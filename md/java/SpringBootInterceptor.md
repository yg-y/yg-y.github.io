# SpringBoot AOP/Interceptor 切面或者拦截器获取 POST 请求 @RequestBody 参数时的问题

> SpringBoot Interceptor 拦截器获取 POST 请求 @RequestBody 参数时，通过 HttpServletRequest.getInputStream() 获取参数时，抛出 I/O error while reading input message; nested exception is java.io.IOException: Stream closed 的问题解决方案

### 问题出现原因

出现这个问题的原因是默认的 HttpServletRequest 对象中的 getInputStream,getReader 函数式只允许调用一次。 在一次请求中，除了我们在切面或者拦截器中调用 getInputStream
之外，SpringBoot 框架在进行参数转换的时候还需要调用 getInputStream 方法读取整个请求的消息体，然后转回为请求参数，这违背了只调用一次的原则，从而触发了以异常。

为了解决这个问题，我们可以引入 HttpServletRequestWrapper 这个对象。这个类封装了 HttpServletRequest 的行为， 我们可以继承这个类，从而使用一个新类模拟原始 HttpServletRequest
的行为。然后使用过滤器（filter）将原始的 HttpServletRequest 对象替换为 HttpServletRequestWrapper 对象。

- 业务拦截器定义及重载后的 HttpServletRequest 包装类使用

```java

import org.springframework.util.StringUtils;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Objects;

/**
 * @author young
 * @version 1.0
 * @date 2021/4/13 11:51 上午
 * @description 验签拦截器
 */
public class SignatureInterceptor implements HandlerInterceptor {

    /**
     * 程序执行之前调用
     *
     * @param request
     * @param response
     * @param o
     * @return
     * @throws Exception
     */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object o) throws Exception {
        // 创建重载后的 HttpServletRequest
        RequestReaderHttpServletRequestWrapper wrapper = new RequestReaderHttpServletRequestWrapper(request);
        // 获取 body 参数
        String bodyParams = wrapper.inputStream2String(wrapper.getInputStream());
        // 业务逻辑
        // ...
        return true;
    }

    /**
     * 程序执行之后执行
     *
     * @param request
     * @param response
     * @param o
     * @param modelAndView
     * @throws Exception
     */
    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object o, ModelAndView modelAndView) throws Exception {
    }

    /**
     * 完成请求处理后（即渲染视图之后）的回调
     *
     * @param request
     * @param response
     * @param o
     * @param e
     * @throws Exception
     */
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object o, Exception e) throws Exception {
    }

}

```

- 注册业务拦截器及注册 重新组装的 HttpServletRequest RequestBodyFilter

```java
package com.yks.oms.order.grab.interceptor;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 * @author young
 * @version 1.0
 * @date 2021/4/13 11:59 上午
 * @description 注册 SignatureInterceptor 拦截器以及 FilterRegistrationBean HttpServletRequest 多次获取流中信息的包装类
 */
@Configuration
public class SignatureConfigurerAdapter extends WebMvcConfigurerAdapter {

    /**
     * 注册自定义的拦截器 SignatureInterceptor
     *
     * @return
     */
    @Bean
    public SignatureInterceptor signatureInterceptor() {
        return new SignatureInterceptor();
    }

    /**
     * 指定拦截请求
     *
     * @param registry
     */
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(signatureInterceptor()).addPathPatterns("/api/*");
    }

    /**
     * 对指定请求的 HttpServletRequest 进行重新注册返回
     *
     * @return
     */
    @Bean
    public FilterRegistrationBean setLogServiceFilter() {
        FilterRegistrationBean registrationBean = new FilterRegistrationBean();
        RequestBodyFilter requestBodyFilter = new RequestBodyFilter();
        registrationBean.setFilter(requestBodyFilter);
        registrationBean.setName("interceptor filter body params");
        registrationBean.addUrlPatterns("/api/*");
        registrationBean.setOrder(1);
        return registrationBean;
    }
}

```

- RequestBodyFilter(核心类)

```java
package com.yks.oms.order.grab.interceptor;

import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

/**
 * @author young
 * @version 1.0
 * @date 2021/4/13 11:51 上午
 * @description 重新组装 HttpServletRequest 返回, 解决拦截器中从流中获取完 post 请求中的 body 参数，controller 层无法再次获取的问题
 */
public class RequestBodyFilter implements Filter {

    @Override
    public void destroy() {
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
                         FilterChain chain) throws IOException, ServletException {
        ServletRequest requestWrapper = null;
        if (request instanceof HttpServletRequest) {
            HttpServletRequest httpServletRequest = (HttpServletRequest) request;
            String method = httpServletRequest.getMethod();
            String contentType = httpServletRequest.getContentType() == null ? "" : httpServletRequest.getContentType();
            // 如果是POST请求并且不是文件上传
            if (HttpMethod.POST.name().equals(method) && !contentType.equals(MediaType.MULTIPART_FORM_DATA_VALUE)) {
                // 重新生成ServletRequest  这个新的 ServletRequest 获取流时会将流的数据重写进流里面
                requestWrapper = new RequestReaderHttpServletRequestWrapper((HttpServletRequest) request);
            }
        }
        if (requestWrapper == null) {
            chain.doFilter(request, response);
        } else {
            chain.doFilter(requestWrapper, response);
        }
    }

    @Override
    public void init(FilterConfig arg0) throws ServletException {
    }
}

```

- RequestReaderHttpServletRequestWrapper(核心类)

```java
package com.yks.oms.order.grab.interceptor;

import com.yks.oms.order.grab.controller.LazadaController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ReadListener;
import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import java.io.*;
import java.nio.charset.Charset;

/**
 * 解决拦截器从流中获取完整的 body 请求参数后，无法再次调用流中数据的问题，否则报以下错误信息
 * <p>
 * I/O error while reading input message; nested exception is java.io.IOException: Stream closed
 */
public class RequestReaderHttpServletRequestWrapper extends HttpServletRequestWrapper {
    private static final Logger LOGGER = LoggerFactory.getLogger(LazadaController.class);

    private final byte[] body;

    public RequestReaderHttpServletRequestWrapper(HttpServletRequest request) throws IOException {
        super(request);
        body = inputStream2String(request.getInputStream()).getBytes(Charset.forName("UTF-8"));
    }

    @Override
    public BufferedReader getReader() throws IOException {
        return new BufferedReader(new InputStreamReader(getInputStream()));
    }

    @Override
    public ServletInputStream getInputStream() throws IOException {

        final ByteArrayInputStream bais = new ByteArrayInputStream(body);

        return new ServletInputStream() {

            @Override
            public int read() throws IOException {
                return bais.read();
            }

            @Override
            public boolean isFinished() {
                return false;
            }

            @Override
            public boolean isReady() {
                return false;
            }

            @Override
            public void setReadListener(ReadListener readListener) {

            }
        };
    }

    /**
     * 将 inputStream 里的数据读取出来并转换成字符串
     *
     * @param inputStream inputStream
     * @return String
     */
    public String inputStream2String(InputStream inputStream) {
        StringBuilder sb = new StringBuilder();
        BufferedReader reader = null;
        try {
            reader = new BufferedReader(new InputStreamReader(inputStream, Charset.forName("UTF-8")));
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        } catch (IOException e) {
            sb.append("get body params fail");
            LOGGER.error(e.getMessage());
        } finally {
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e) {
                    LOGGER.error(e.getMessage());
                }
            }
        }
        return sb.toString();
    }
}
```

重新测试即可在切面或者拦截器多次调用 getInputStream 方法获取 body 参数