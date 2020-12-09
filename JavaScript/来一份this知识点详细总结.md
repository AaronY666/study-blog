## 前言
`this`在`JavaScript`中是非常重要的概念，因为我们用到它的频率非常之高，在享受到它的便利性的同时，与之对应的是它的绑定规则比较难理解。今天我们就来好好总结一下`this`的相关知识点，这样在使用它的过程中就能更有自信和把握啦！
## 了解一下`this`
老规矩，在总结之前我们需要得先了解一下，`this`是什么东西？
### `this`是什么
我们先来看一个例子：
```js
    function foo() {
      console.log(this);	//Window
    }
    foo();
```
我们定义了一个函数`foo`并执行，在函数体中我们直接打印输出`this`，发现结果并不是`undefined`,而是`Window`对象。这是为什么呢？这就引出了相关的概念：
> `this`是一个很特别的关键字，被自动定义在所有函数的作用域中。

只看概念云里雾里的，但这句话讲出了两个关键点：  
1. `this`是一个**关键字**
2. `this`被**自动定义**在所有函数的作用域中

我们分别剖析一下：
#### 1. `this`是一个关键字
这句话说出了`this`的本质其实是一个关键字，只不过有些特别，具体特别在哪里我们下面再介绍。既然`this`是一个关键词，我们就得注意它应该具备的一个特点了：**`this`无法被重写**。我们修改一下刚刚的例子试试：
```js
    function foo() {
      this = "null"; //Uncaught SyntaxError
      console.log(this);
    }
    foo();
```
可以看到，`this`的值无法被修改，否则会报错。
#### 2. `this`被**自动定义**在所有函数的作用域中
这句话里面包含很多信息点，首先就是**自动定义**这个说法，指出了`this`这个关键词在函数作用域中会被自动定义，这也就是为什么我们刚刚在`foo`函数中可以直接输出`this`得到`Window`对象。  

其次是**所有函数的作用域中**，这句话说明了，在所有的的函数作用域中都存在`this`关键字。但这不是说只有在函数中才有`this`，假如我们试着在全局直接输出`this`会是什么结果呢？
```js
console.log(this);	//Window
```
可以看到，同样输出了`Window`对象，这说明在全局作用域下同样存在`this`关键词。  

看到这里你可能有点疑问了，为什么举得例子中，`this`的值都是`Window`对象，是不是`this`的值就是等于`Window`对象呢？我们再看个例子：
```js
    var obj = {
      say: function () {
        console.log(this);
      },
    };
    obj.say();	//{say: ƒ}
```
我们将例子修改了一下，发现此时输出的`this`值变成了`obj`对象，这说明`this`的值并不是之前猜测的固定等于`Window`对象，那么`this`值到底是怎么来的呢？
### `this`的指向值
事实上，我们之前在介绍**执行上下文**的时候有介绍到(感兴趣的话可以点[**这里**](https://juejin.cn/post/6889712179264618503)看一下)，在动态创建执行上下文时，会确认`This Binding`也就是`this`的值，**它和函数定义的位置无关，而是由函数调用时的绑定规则决定的**。

这也就是为什么，在全局的情况下`this`值也是存在的，正是因为存在**全局上下文**,而且`this`的值就存储在这个上下文中。  

那么`this`值具体指向谁，函数调用时的绑定规则是什么，这就是我们接下来要讲的重头戏了。

## this的绑定规则
我们刚刚讲了，`this`的指向值由函数调用时的绑定规则决定，我们现在就来讲讲这些**绑定规则**分别有哪些。

### 默认绑定
**默认绑定**是最基本的绑定规则，它被应用在其他规则均不适用的情况下，因此也是最常见的绑定规则。默认绑定比较典型的一种判断就是：**当使用不带任何修饰的函数引用进行调用时，只能使用默认绑定，而不能使用其他绑定规则。** 举个例子：
```js
function foo(){
	console.log(this);	//Window
}
foo();
```
可以看到，这里的`foo()`就是不带任何修饰的函数调用，`foo`前面光秃秃的啥也没有。另外你会发现，这里输出的`this`值为`Window`对象，那大家就已经知道了这可能就是默认规则下`this`的指向值，不过不准确，事实上默认规则下`this`的指向值可以分几种情况：
- **严格模式**
在严格模式下，使用默认规则得到的`this`值会指向`undefined`，可以看代码：
```js
'use strict'
function foo(){
	console.log(this);	//undefined
}
foo();
```
- **非严格模式**
非严格模式下，如果应用了默认规则，那么`this`的值会指向`Window`对象，这也就是为什么我们刚刚举得好几个例子`this`值都是`Window`，看下代码：
```js
function foo(){
	console.log(this);	//Window
}
foo();
```
- **严格模式和非严格模式混用**
这种模式比较特殊，如果我们在非严格模式下定义了函数，又在严格模式下调用了函数，最终`this`的值还是会指向`Window`对象，看下代码：
```js
    function foo() {
      console.log(this);	//Window
    }
    {
      ("use strict");
      foo();
    }
```
### 隐式绑定
讲完了默认的绑定规则，那么肯定要看看一些特殊的绑定规则了。当函数作为某个对象的方法调用时，此时这个对象就是函数的上下文对象，这时候`this`会指向这个对象，我们来看个例子：
```js
    var obj = {
      foo: function () {
        console.log(this);	//{foo: ƒ}
      },
    };
    obj.foo();
```
可以看到，我们给对象`obj`定义了一个方法`foo`，并通过`obj.foo()`的方式进行调用，此时的`obj`对象就是函数`foo`调用时的上下文对象，因此`this`会指向`obj`对象，我们把这种情况称为**隐式绑定**。隐式绑定有几个重要的点需要着重说明一下：
#### **隐式丢失**
隐式绑定的函数，在有些情况下会丢失绑定的上下文对象，这时候就会应用我们的**默认绑定**规则，把`this`指向`Window对象`（非严格模式）或者`undefined`（严格模式）。我们先来看一个例子：
```js
    var name = "我是全局的name";
    var obj = {
      name: "我是obj的name",
      foo: function () {
        console.log(this.name); //我是全局的name
      },
    };
    let fn = obj.foo; //这里用变量fn保存foo函数
    fn();
```
这里我们用一个变量`fn`保存了`obj`下的`foo`函数的引用，此时调用以后输出的是全局对象下定义的`name`变量值，可见此时的`this`对象指向了`Window`。  

当我们执行`let fn = obj.foo`时，实际上是将`fn`指向了函数`foo`的地址，因此当我们执行`fn()`的时候实际上就是在执行`foo()`，上面的代码也就是这样:
```js
    var name = "我是全局的name";
    function foo() {
      console.log(this.name); //我是全局的name
    }
    foo();
```
这时候实际上就是**不带任何修饰的函数调用**，因此会应用默认绑定规则。

隐式丢失还有一种情况，就是对象的方法作为参数传递到另外的函数中去，来看个例子：
```js
    var name = "我是全局的name";
    var obj = {
      name: "我是obj的name",
      foo: function () {
        console.log(this.name); //我是全局的name
      },
    };

    function otherFn(fn) {
      fn();
    }
    otherFn(obj.foo);
```
这个例子和上个例子唯一的不同就是在后面，我们不是通过变量保存`foo`函数后再调用，而是把`foo`函数作为参数传递给了另一个函数，然后在另一个函数中调用，这里为什么也发生了隐式丢失呢？

答案是，参数在传递给函数的时候，会发生一个赋值操作，也就是将**实参赋值给形参**，函数部分的代码可以看成这样：
```js
    function otherFn() {
      var fn = obj.foo;	//这里实际上就是将实参赋值给形参
      fn();
    }
    otherFn(obj.foo);
```
这下我们就发现了，这种情况和上面那种**隐式丢失**的情况一样，也是**不带任何修饰的函数调用**，因此也应用了默认规则，发生了**隐式丢失**。
#### **对象属性引用链**
我们刚刚说到，当函数作为对象的方法调用时，会以这个对象作为上下文对象，所以`this`会指向这个对象，那么当多个对象嵌套在一起后调用方法以后`this`会指向哪个对象呢？我们来看个例子：
```js
    var obj1 = {
      name: "obj1",
      obj2: {
        name: "obj2",
        obj3: {
          name: "obj3",
          foo: function () {
            console.log(this.name); //obj3
          },
        },
      },
    };
    obj1.obj2.obj3.foo();
```
是不是看蒙了？不要怕，我们看到结果输出了`obj3`，事实上当我们通过对象属性调用链来调用方法时，最终起作用的只有函数前面的那个调用对象。比如刚刚的`obj1.obj2.obj3.foo()`，实际上可以看成`obj3.foo()`。同理，哪怕是`...a.b.c.d.e.foo()`，我们只要看最后的`e.foo()`即可。
### 显式绑定
我们刚刚介绍了**隐式绑定**，`this`的指向值完全由调用对象决定，十分难把控，有没有一个办法，不管我是通过哪个对象调用的，我都可以指定我想要的`this`指向值呢？有的，在函数的原型上有两个方法`call`和`apply`，可以传入指定的对象作为`this`的指向值，不过两者有一些区别，我们来分别看下用法。
#### call的用法
关于`call`的定义和基本用法可以参照MDN：[传送门](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call)  

我们看看`call`如何显式的改变`this`的指向值：
```js
    var obj = {
      name: "obj",
    };
    function foo() {
      console.log(this.name);	//obj
    }
    foo.call(obj);
```
`foo`函数调用`call`方法，并传入`obj`作为第一个参数，`obj`会作为`foo`函数的`this`指向值，并执行函数。那么`call`方法是如何实现这样的功能的呢？我们下面再讲，我们先来看下`apply`。

#### apply的用法
关于`apply`的定义和基本用法可以参照MDN：[传送门](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)   

`apply`的用法和效果和`call`几乎一样，看例子就可以看出来：
```js
    var obj = {
      name: "obj",
    };
    function foo() {
      console.log(this.name);	//obj
    }
    foo.apply(obj);
```
从这两个例子来看的话，两者几乎完全相同，但它们还是有区别的，区别就在于它们接收参数的方式不同，我们看个例子：
```js
    var obj = {
      name: "obj",
    };
    function foo(a,b,c) {
      console.log(this.name,a,b,c);	//obj 1 2 3
    }
    foo.call(obj,1,2,3);
    foo.apply(obj,[1,2,3]);
```
可以看到，`call`函数接收多个参数并传入`foo`函数中，而`apply`函数接收的参数放在了一个数组里，然后拆分开来传入了`foo`函数中，这就是两者的区别。

我们通过调用`call`或者`apply`的方式显式的绑定了`this`的指向值，但是你会发现通过`call`或者`apply`的方式会直接调用函数，就没办法把函数连带着`this`一起传到别的函数中存储或者执行。能不能**给函数先绑定好了`this`值，再套个壳子包装好，这样就可以传来传去的还保留着绑定好的`this`值了呢**？于是我们的`bind`函数就应运而生了。
#### bind的用法
关于`bind`的定义和基本用法可以参照MDN：[传送门](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) 

`bind`函数可以传入指定对象作为`this`的指向对象，除此之外，`bind`函数还可以接受参数并存储起来，下次调用的时候可以只传入剩余的参数，我们来看个例子：
```js
    //还是刚刚隐式丢失的例子，我们使用bind函数绑定上obj对象看看
    var name = "我是全局的name";
    var obj = {
      name: "我是obj的name",
      foo: function () {
        console.log(this.name);
      },
    };

    function otherFn(fn) {
      //会发现函数被传入进来以后，this依然指向obj而没有发生隐式丢失
      fn(); //我是obj的name
    }
    otherFn(obj.foo.bind(obj)); //我们这里不直接传入，而是把obj.foo包装一下再传入
```
从这个例子我们可以看到，通过`bind`绑定了`this`指向值的函数，即使传入了其他函数中执行也不会丢失`this`对象。我们再举个例子看看，如何在绑定`this`的同时存储参数：
```js
    function foo(a, b, c) {
      console.log(a, b, c);
    }

    //第一个参数为null时，非严格模式下会以Window对象作为this指向值，后面会介绍
    //给foo函数套了层壳子，并存储了两个参数1,2
    var bindFoo = foo.bind(null, 1, 2);
    //当调用这个包装函数的时候，传入的参数会连同之前存储的参数一起传给foo函数
    bindFoo(3); //1 2 3
```
这样我们就实现了预传参数和`this`值，可以方便传值的函数啦~  

还有一种情况，我觉得这种显示绑定的方式太僵硬了，其实我想要一种更灵活的绑定方式，**我想预设一个`this`指向对象，当我不小心应用了默认绑定规则，`this`指向了`Window`或者`undefined`时候把`this`重新指向我预设的对象，否则的话就指向他本来的this对象**，这样可以吗？好家伙，要求还不少，但是我满足你了，那就是我们的`softBind`啦~
#### softBind的用法
`softBind`函数在函数原型上并不存在，是后来创造的，顾名思义就是软绑定，为了实现我们刚刚说的需求而出现的。
既然原型上没有，自然要介绍一下怎么定义实现的啦：
```js
    Function.prototype.softBind = function (obj) {
      //先拿到调用softBind的函数本身
      var fn = this;

      //这里是为了拿到传入的其他参数，并存储起来
      var curried = [].slice.call(arguments, 1); //arguments是类数组所以没有slice方法

      //这里是返回的包装好的函数
      var bound = function () {
        
        //判断this的情况，这里的this是返回的封装函数执行时的this，和调用softBind函数时的this不同
        var that = (!this || this === (window || global)) ? obj : this; //判断this是否空，同时考虑node环境

        //这里的目的是为了把包装时传入的参数，和执行包装函数时传入的参数进行合并，arguments和之前的arguments不同
        var newArguments = [].concat.apply(curried, arguments);

        //这里其实就是调用函数
        return fn.apply(that, newArguments);
      };

      //有一个细节是调整包装好的函数的原型链，使得instanceof能够用于包装好的函数的判断
      bound.prototype = Object.create(fn.prototype);
      return bound;
    };   
```
看不懂的话慢慢琢磨一下，然后我们来举个例子看看它的用法：
```js
    var name = "我是全局的name";
    var obj1 = {
      name: "我是obj1的name"
    };
    var obj2 = {
      name: "我是obj2的name"
    };

    function foo(){
    	console.log(this.name)
    }
    
    //包装一个默认this为obj1的函数
    var fn=foo.softBind(obj);
    
    //当通过obj2调用时，会使用obj2作为this值
    fn.call(obj2);	//我是obj2的name
    
    //当不加修饰符调用时,会应用绑定的this值
    fn();	//我是obj1的name
```
这样我们就实现了一个灵活的显示绑定函数啦~
### new绑定
`new`操作符也可以实现改变`this`指向，关于`new`操作符的知识点我在之前的文章有介绍过：[传送门](https://juejin.cn/post/6876726030162362375)，这里我们简单介绍下`new`操作符做了什么：
- 创建一个新对象，将this绑定到新创建的对象
- 使用传入的参数调用构造函数
- 将创建的对象的_proto__指向构造函数的prototype
- 如果构造函数没有显式返回一个对象，则返回创建的新对象，否则返回显式返回的对象（即手动返回的对象）

然后我们来看个例子：
```js
function Foo(name){
	this.name=name;
}

let person=new Foo('xiaowang');
console.log(person);	//xiaowang
```
可以看到，当函数作为构造函数执行`new`的过程中，`this`指向了最终创建的实例`person`，说明`new`操作符确实能够改变`this`的指向。
### 箭头函数绑定
除了之前介绍的那么多种，还存在着一种`ES6`中的特殊函数类型：**箭头函数**。箭头函数中的`this`比较特殊，它的指向值不是动态决定的，而是由函数定义时作用域中包含的`this`值确定的，我们举个例子：
```js
    //定义一个箭头函数
    var foo = () => {
      console.log(this.name);
    };
    var name = "我是全局的name";
    var obj1 = {
      name: "我是obj1的name",
    };

    foo.call(obj1); // "我是全局的name"
```
可以看到，虽然我们调用了`call`传入了`obj1`，但最终输出的值还是全局的`name`，这是因为函数`foo`定义在全局中，因此`this`会指向`window`对象。

## 绑定规则的优先级
讲了这么多，头都大了，不要着急，休息会儿我们再来看个关键的知识点，关于`this`**绑定规则的优先级**。我们刚刚讲了很多绑定规则，但没有讲这些绑定规则组合起来的结果会是如何，**当多个绑定规则同时运用的时候，会使用优先级更高的绑定规则**。那这些规则的优先级怎么排列呢？我们按照由低到高进行排序的话就是：
1. **默认绑定**
2. **隐式绑定**
3. **显示绑定**
4. **new操作符绑定、箭头函数**
接下来我们分别看几个例子来验证它们的优先级：
- **默认绑定和隐式绑定**
直接看开始的例子就好了：
```js
var obj = {
      foo: function () {
        console.log(this);	//{foo: ƒ}
      },
    };
    obj.foo();
```
毫无疑问，结果应用了隐式绑定的`this`值，因此**隐式绑定的优先级是大于默认绑定的**。
- **隐式绑定和显示绑定**
我们也举个简单的例子：
```js
    var obj1 = {
      name: "obj1",
      foo: function () {
        console.log(this.name);
      },
    };
    var obj2 = {
      name: "obj2",
    };

    obj1.foo.apply(obj2); //obj2
    obj1.foo.call(obj2); //obj2
    obj1.foo.bind(obj2)(); //obj2
```
最终也可以看出来，隐式绑定的结果被显示绑定覆盖了,因此**显式绑定的优先级是大于隐式绑定的**。
- **显示绑定和new操作符绑定**
由于`call`和`apply`只能执行函数，没法和`new`操作符一起使用，因此我们只对比`bind`函数和`new`操作符的优先级。
```js
    var obj = {};
    function foo() {
      this.name = "obj";
    }
    //将foo绑定到obj上
    var fn = foo.bind(obj);

    //执行new操作
    var f1 = new foo();
    console.log(obj.name); //undefined
    console.log(f1.name); //obj
```
可以看到，`foo`已经显式绑定`obj`对象了，最终`name`值还是赋值到了实例`f1`上，因此**new操作符绑定的优先级是大于显式绑定(`bind`)的**。  

你可能会疑惑，`bind`明明为`foo`函数套了层壳，按照`new`操作符的逻辑怎么都不能把里面的`this`指向改了才对，**事实上`bind`函数内部做了判断，如果和`new`操作符一起使用的话，要把`this`让给`new`操作符的对象**，这也坐实了它们之间优先级的关系了。

- **箭头函数绑定和new操作符绑定**
由于**箭头函数**是不可构造的，所以无法和`new`操作符组合，因此我把他们放在了同级。

## 加强理解：手写call，apply，bind函数
### call实现
我们以`foo.call(obj)`举例说明：
```js
  Function.prototype.myCall = function (context) {
    //判断传入的this指向值是否为空，context其实就是obj
    context = context || window;

    //我们命名一个独一无二的属性名，避免重名导致覆盖
    let fn = new Symbol('fn');

    //这里的this其实就是函数foo，我们把它作为传入的context对象的属性进行调用，这样就可以利用隐式绑定的规则设置this
    context[fn] = this

    //去除掉传入的context值，剩下的就是参数了
    const args = [...arguments].slice(1);

    //执行函数并返回结果
    const result = context.fn(...args);

    //删除这个属性值，销毁犯罪现场
    delete context.fn;

    return result;
  }
```
### apply
我们同样以`foo.apply(obj)`举例说明，大部分代码相同，但传入的参数由于是数组，所以参数数量是已知的：
```js
  Function.prototype.myApply = function (context, args) {
    //判断传入的this指向值是否为空，context其实就是obj
    context = context || window;

    //我们命名一个独一无二的属性名，避免重名导致覆盖
    let fn = new Symbol('fn')

    //这里的this其实就是函数foo，我们把它作为传入的context对象的属性进行调用，这样就可以利用隐式绑定的规则设置this
    context[fn] = this

    //执行函数并返回结果，...可以把数组中的参数展开
    const result = context[fn](...args);

    //删除这个属性值，销毁犯罪现场
    delete context.fn;

    return result;
  }
```

### bind
`bind`的话其实就是对上面的显示绑定做了包装，同样以`foo.bind(obj)`为例：
```js
Function.prototype.myBind = function (context, ...args) {
    //同样是为了拿到调用bind的函数本身，如foo
    const fn = this

    //对参数做个空处理
    args = args ? args : []

    //bind会返回一个闭包函数，保存传入的context和参数
    return function newFn(...newFnArgs) {
      //对new操作和bind组合的情况，做处理，把this让给new
      if (this instanceof newFn) {
        return new fn(...args, ...newFnArgs)
      }

      //否则直接通过apply显示绑定context目标
      return fn.apply(context, [...args, ...newFnArgs])
    }
  }
```
大功告成！
## 总结
关于`this`的知识点总结写了很多，我不想只是简单的罗列知识点，而是想要有条理有层次的介绍，同时写出我自己的理解，这样的总结才更有意义。码了这么多字真不容易，希望能帮到你们~最后毕竟内容比较多，有错误的地方希望大家指出，谢谢！
## 写在最后

1. **很感谢你能看到这里，不妨点个赞支持一下,万分感激~!**

2. **以后会陆续更新更多文章和知识点，感兴趣的话可以关注一波~**