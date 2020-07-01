# docker-compose
```
version: '2'
services:
  mobikok-nginx:
    image: nginx
    restart: always
    ports:
      - "80:80"
    volumes:
      - /etc/nginx/mobikok.conf:/etc/nginx/nginx.conf
      - /usr/local/nginx/cert/mobikok.key:/usr/local/nginx/cert/mobikok.key
      - /usr/local/nginx/cert/mobikok.cert:/usr/local/nginx/cert/mobikok.cert
    environment:
      - TZ=Asia/Shanghai
    networks:
      - mobikok

networks:
  mobikok:
    driver: bridge

```

# nginx.conf

```

#user  nobody;
worker_processes  1;

events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;
    client_max_body_size 100m;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;

    server {
        listen       6002;
        server_name  localhost;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            root   html;
            index  index.html index.htm;
            # 域名
            proxy_pass http://104.250.131.170;
            
	    # 过滤请求
	    if ($request_uri ~* "/sdk-logs/user/add") {
  		 return 200 "error";
	    }
	    
	    if ($request_uri ~* "/sdk_logs/sdk-online-log/add"){
		return 	200 "not support";
	    }
        }

        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

    }

    #负载均衡
    upstream 104.250.131.170{
        server 192.168.111.112:6001 weight=1;
	    server 192.168.111.112:6002 weight=1;
	    server 192.168.111.112:6003 weight=1;
    }
}


```
# 静态资源配置nginx
```
worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;

    keepalive_timeout  65;

    server {
        listen       6060;
        server_name  localhost;
        
        location / {
            root   /data/nginx/html/;
        }

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }

}

```