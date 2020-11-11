## 前言

在学习JavaScript的过程中，不可避免的会遇到`new`操作符,这次就来好好刨根问底一下，也算是加深理解和记忆了。

## 什么是new操作符？

mdn中是这么定义`new`操作符的:

> new 运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例。  

在这句话里我们来看一个关键词：```具有构造函数```。这是个什么意思呢？我们先通过几个例子来看一下：
```js
//例1
let Animal1=function(){this.name=1};
let animal=new Animal1; //这里不带()相当于不传参数
//=>Animal1 {name: 1}

//例2
let TestObj={}
let t1=new TestObj;
//=>Uncaught TypeError: TestObj is not a constructor
```
我们可以看到，例1成功的执行了`new`语句，创建出了实例。例2在`new`一个`{}`对象时报错`TypeError: TestObj is not a constructor`，指出目标不是一个`constructor`。为什么普通的对象就不能执行`new`操作符呢？在[ECMA规范](https://www.ecma-international.org/ecma-262/7.0/#sec-abstract-operations)里有相关的介绍:
>If Type(argument) is not Object, return false.  
>If argument has a `[[Construct]]` internal method, return true.
>Return false.

  意思就是:
  - **构造函数首先得是一个对象，否则不满足条件**
  - **其次，对象必须拥有`[[Construct]]`内部方法，才可以作为构造函数**  

我们这里的`{}`就是一个对象，满足第一个条件，那么显然，肯定是因为`{}`没有`[[Construct]]`这个内部方法，所以无法使用`new`操作符进行构造了。  

那么我们已经搞定了`new`操作符的可操作对象，是不是可以去看看它的作用了呢？答案是：NO！我们再来看一个例子：
```js
//例3
let testObj={
	Fn(){
    	console.log("构造成功！")
    }
}
let t3=new testObj.Fn;
//=>Uncaught TypeError: testObj.Fn is not a constructor
```
what?为什么刚刚还能成功构造的函数，作为方法就不行了呢？其实在[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Method_definitions#Method_definitions_are_not_constructable)中也有直接介绍:
>Methods cannot be constructors! They will throw a TypeError if you try to instantiate them.

意思就是，**方法不能是构造函数**，如果尝试创建一个方法的实例，就会抛出类型错误。这样说就懂了，但是还没完，这个说法没有完全解释清楚原理，我们再看个例子：
```js
//例4
const example = {
  Fn: function() { console.log(this); },
  Arrow: () => { console.log(this); },
  Shorthand() { console.log(this); }
};
new example.Fn();        // Fn {}
new example.Arrow();     // Uncaught TypeError: example.Arrow is not a constructor
new example.Shorthand(); // Uncaught TypeError: example.Shorthand is not a constructor
```
对照这个例子，我们在[ECMA规范](https://www.ecma-international.org/ecma-262/7.0/#sec-abstract-operations)查阅，发现所有的函数在创建时都取决于`FunctionCreate`函数:
>FunctionCreate (kind, ParameterList, Body, Scope, Strict, prototype)  
>1. If the prototype argument was not passed, then let prototype be the intrinsic object %FunctionPrototype%.  
>2. If "kind" is not Normal, let allocKind be "non-constructor".  

这个函数的定义可以看出
- **只有当类型为`Normal`的函数被创建时，它才是可构造的函数，否则他就是不可构造的。**

在我们这个例子中，`Arrow`的类型为`Arrow`,而`ShortHand`的类型是`Method`,因此都不属于可构造的函数，这也解释了例3所说的"方法不能作为构造函数"。
	搞清楚了`new`操作符可以操作的目标，终于可以神清气爽的来看看它的作用了（不容易呀TAT）。

## new操作符实现了什么？
我们举一个简单的例子来具体看看它的作用:

```js
function Animal(name){
	this.name=name;
    console.log("create animal");
}

let animal=new Animal("大黄");  //create animal

console.log(animal.name);		//大黄

Animal.prototype.say=function(){
	console.log("myName is:"+this.name);
}
animal.say();					//myName is:大黄
```
我们从这个例子来分析一下，首先我们看这一句：
```js
let animal=new Animal("大黄");
```
可以看到，执行`new`操作符后，我们得到了一个`animal`对象，那么我们就知道，`new`操作符肯定要创建一个对象，并将这个对象返回。再看这段代码:
```js
function Animal(name){
	this.name=name;
    console.log("create animal");
}
```
同时我们看到结果，确实输出了`create animal`,我们就知道，`Animal`函数体在这个过程中被执行了，同时传入了参数，所以才执行了我们的输出语句。但我们的函数体里还有一句`this.name=name`体现在哪里呢？就是这一句:
```js
console.log(animal.name);		//大黄
```
执行完函数体后，我们发现返回对象的`name`值就是我们赋值给`this`的值，那么不难判断，在这个过程中，`this`的值指向了新创建的对象。最后还有一段：
```js
Animal.prototype.say=function(){
	console.log("myName is:"+this.name);
}
animal.say();					//myName is:大黄
```
`animal`对象调用的是`Animal`函数原型上的方法，说明`Animal`在`animal`对象的原型链上，那么在哪一层呢？我们验证一下：
```js
animal.__proto__===Animal.prototype; //true
```
那我们就知道了，`animal`的`__proto__`直接指向了`Animal`的`prototype`。
除此之外，如果我们在构造函数的函数体里返回一个值，看看会怎么样：
```js
function Animal(name){
	this.name=name;
    return 1;
}
new Animal("test"); //Animal {name: "test"}
```
可以看到,直接无视了返回值，那我们返回一个对象试试：
```js
function Animal(name){
	this.name=name;
    return {};
}
new Animal("test"); //{}
```
我们发现返回的实例对象被我们的返回值覆盖了，到这里大致了解了`new`操作符的核心功能，我们做一个小结。

### 小结
**`new`操作符的作用：**
- **创建一个新对象，将`this`绑定到新创建的对象**
- **使用传入的参数调用构造函数**
- **将创建的对象的`_proto__`指向构造函数的`prototype`**
- **如果构造函数没有显式返回一个对象，则返回创建的新对象，否则返回显式返回的对象（如上文的`{}`）**

## 模拟实现一个new操作符
说了这么多理论的，最后我们亲自动手来实现一个`new`操作符吧~
```js
var _myNew = function (constructor, ...args) {
    // 1. 创建一个新对象obj
    const obj = {};

    //2. 将this绑定到新对象上，并使用传入的参数调用函数

    //这里是为了拿到第一个参数，就是传入的构造函数
    // let constructor = Array.prototype.shift.call(arguments);
    //绑定this的同时调用函数,...将参数展开传入
    let res = constructor.call(obj, ...args)

    //3. 将创建的对象的_proto__指向构造函数的prototype
    obj.__proto__ = constructor.prototype

    //4. 根据显示返回的值判断最终返回结果
    return res instanceof Object ? res : obj;
}
```
上面是比较好理解的版本，我们可以简化一下得到下面这个版本：
```js
function _new(fn, ...arg) {
    const obj = Object.create(fn.prototype);
    const res = fn.apply(obj, arg);
    return res instanceof Object ? res : obj;
```
大功告成！
## 总结
本文从定义出发，探索了`new`操作符的作用目标和原理，并模拟实现了核心功能。其实模拟实现一个`new`操作符不难，更重要的还是去理解这个过程，明白其中的原理。
## 写在最后
本人小白一个，可能有些资料查的不是很全或是有错误，欢迎指出，一定会及时改正。如果觉得这篇文章对你有帮助的话，不妨点个赞支持一下，谢谢！