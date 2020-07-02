> 前言: 前段时间，因为业务需求需要根据用户角色动态导出excel，不同角色看到的列不同。以前用到的方法基本是(或者有其他土方法)，创建多个实体类，每个实体类对应的列不同，以此来实现动态导出，但显然这是个笨方法，虽然省时省力，但好像总觉得哪里不对。正片开始
---
easypoi链接: [EasyPoi官方文档](http://easypoi.mydoc.io/)

我们使用的注解版的导出 `@Excel`，官方文档中说明很详细，默认大家都会用，不会用的，copy一下官网的，跑一下，调一下就行了。

#### 举个栗子：
```java
@Data
@ExcelTarget("TestExcle")
public class TestExcle implements Serializable {
    private static final long serialVersionUID = 4152437113488964399L;

    @Excel(name = "名称")
    private String name;
    @Excel(name = "年龄", isColumnHidden = true))
    private String age;
    @Excel(name = "学校")
    private String school;
    @Excel(name = "状态", replace = { "毕业_1", "在校_2" })
    private Integer status;
}
```
#### 我们需要用到的是EasyPoi官方提供的这个属性 isColumnHidden

属性 | 类型 |  默认值  |功能
-|-|-|-
isColumnHidden |boolean| false |导出隐藏列

```java
// 点击@Excel注解进去看到源码
/**
 *  是否需要隐藏该列
 * @return
 */
public boolean isColumnHidden() default  false;
```

可以看到，`isColumnHidden`中提供的默认值是false，也就是默认全部导出，不隐藏。假如我的权限是学生`(ST)`，在登录教务系统时，导出班级学生信息时，不想让学生看到各班同学的年龄情况，可以把它设置成 `true` ，不要问我为什么不能看到年龄？？？这样所有导出都没有学生列，但是如果教师`(TC)`(你们可怕的班主任或者往上的教导主任)导出时是可以看到年龄信息的。

#### 思路: 
> JAVA反射机制是在运行状态中，对于任意一个实体类，都能够知道这个类的所有属性和方法；对于任意一个对象，都能够调用它的任意方法和属性；这种动态获取信息以及动态调用对象方法的功能称为java语言的反射机制。——百度百科

根据反射我们可以拿到一个类的所有属性和方法，同理，注解也是一个类，也是可以拿到它的属性和方法，拿到之后就好办了，直接修改它的默认值，然后根据每个角色调整，就可以达到一个类实现动态导出的目的

以上面 TestExcle 为例：
先创建一个工具类，传入`TestExcle`对象，获取注解值，并修改

```java
/**
 * 动态显示Excel导出列
 *
 * @param <T>
 * @author young
 */
public class EasyPoiUtil<T> {

/**
 * 需要被反射的对象，使用泛型规范传入对象
 */
public T t;

/**
 * 动态更改EasyPoi中控制列显示的值
 *
 * @param columnName 需要转换的列属性名称
 * @param target     默认true
 * @throws NoSuchFieldException
 * @throws IllegalAccessException
 */
public void hihdColumn(String columnName, Boolean target) throws Exception {
    if (t == null) {
        throw new ClassNotFoundException("TARGET OBJECT NOT FOUNT");
    }
    if (StringUtils.isEmpty(columnName)) {
        throw new NullPointerException("COLUMN NAME NOT NULL");
    }
    if (target == null) {
        target = true;
    }
    //获取目标对象的属性值
    Field field = t.getClass().getDeclaredField(columnName);
    //获取注解反射对象
    Excel excelAnnon = field.getAnnotation(Excel.class);
    //获取代理
    InvocationHandler invocationHandler = Proxy.getInvocationHandler(excelAnnon);
    Field excelField = invocationHandler.getClass().getDeclaredField("memberValues");
    excelField.setAccessible(true);
    Map memberValues = (Map) excelField.get(invocationHandler);
    memberValues.put("isColumnHidden", target);
}
```
然后在需要导出的数据中更改对应角色能看到的列
```java

//数据集合，一般都是从数据库中获取，这里仿造数据
List<TestExcle> list = new ArrayList<>();
list.add(...);
...

for (TestExcle item : list){
    // roles 为当前用户登录的权限列表，各个系统都不一样，但都能获得
    // 如果是学生 ST 则隐藏 easyPoiUtil.hihdColumn("age", true);
    if (roles.contains('ST')) {
        EasyPoiUtil<ProductOrder> easyPoiUtil = new EasyPoiUtil<>();
        easyPoiUtil.t = item;
        try {
            easyPoiUtil.hihdColumn("age", true);
        } catch (Exception e) {
            log.info("列隐藏转换失败：{}", e.getMessage());
            e.printStackTrace();
        }
    } 
    // 如果是教师 TC 则显示 easyPoiUtil.hihdColumn("age", false);
    if (roles.contains('TC')) {
        EasyPoiUtil<ProductOrder> easyPoiUtil = new EasyPoiUtil<>();
        easyPoiUtil.t = item;
        try {
            easyPoiUtil.hihdColumn("age", false);
        } catch (Exception e) {
            log.info("列隐藏转换失败：{}", e.getMessage());
            e.printStackTrace();
        }
    } 
}
```

导出之后，对应的角色就可以看到对应的列。如果有多个列表的话就多次调用即可
```java
easyPoiUtil.hihdColumn("age", true);
easyPoiUtil.hihdColumn("school", true);
```

# 大大的完结！
日常记录开发小技巧