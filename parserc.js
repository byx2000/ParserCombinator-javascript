// 设置继承关系
function extend(child, parent)
{
    var F = function(){};
    F.prototype = parent.prototype;
    child.prototype = new F();
    child.prototype.constructor = child;
}

// 设置属性
function setProperty(cons, prop, value)
{
    cons.prototype[prop] = value;
}

// 派生解析器
function makeParser(child, parse)
{
    extend(child, Parser);
    setProperty(child, "parse", parse);
}

/**
 * 解析器基类
 */
function Parser()
{
    this.parser = [null];
}
Parser.prototype.set = function(p)
{
    this.parser[0] = p;
}
Parser.prototype.parse = function(input)
{
    return this.parser[0].parse(input);
}
Parser.prototype.concat = function(p)
{
    return new Concat(this, p);
}
Parser.prototype.or = function(p)
{
    return new Or(this, p);
}
Parser.prototype.zeroOrMore = function()
{
    return new ZeroOrMore(this);
}
Parser.prototype.oneOrMore = function()
{
    return new OneOrMore(this);
}
Parser.prototype.transform = function(handler)
{
    return new Transform(this, handler);
}
Parser.prototype.skip = function(p)
{
    return new SkipSecond(this, p);
}

/**
 * 创建解析器，稍后用set方法设置解析器
 */
function createParser()
{
    return new Parser();
}

/**
 * 创建空解析器
 */
function empty()
{
    return new Empty();
}

/**
 * 创建字符解析器
 * @param {*} ch 字符
 */
function char(ch)
{
    return new Char(ch);
}

/**
 * 创建接受符合要求的字符的解析器
 * @param {*} predicate 谓词
 */
function satisfy(predicate)
{
    return new Satisfy(predicate);
}

/**
 * 创建字符范围解析器
 * @param {*} c1 字符1
 * @param {*} c2 字符2
 */
function range(c1, c2)
{
    return new Range(c1, c2);
}

/**
 * 创建字符串常量解析器
 * @param {*} str 字符串
 */
function literal(str)
{
    return new Literal(str);
}

/**
 * 跳过指定解析器
 * @param {*} p 
 */
function skip(p)
{
    var obj = 
    {
        concat: function(p1)
        {
            return new SkipFirst(p, p1);
        }
    };
    return obj
}

/**
 * 空解析器
 */
function Empty()
{

}
makeParser(Empty, function(input)
{
    return [null, input];
});

/**
 * 接受指定字符的解析器
 * @param {*} ch 字符
 */
function Char(ch)
{
    this.ch = ch;
}
makeParser(Char, function(input)
{
    if (input == "") return null;
    if (input[0] != this.ch) return null;
    var result = input[0]
    var remain = input.substring(1);
    return [result, remain];
});

/**
 * 接受符合要求的字符的解析器
 * @param {*} predicate 谓词
 */
function Satisfy(predicate)
{
    this.predicate = predicate;
}
makeParser(Satisfy, function(input)
{
    if (input == "") return null;
    if (!this.predicate(input[0])) return null;
    var result = input[0]
    var remain = input.substring(1);
    return [result, remain];
});

/**
 * 解析指定范围内的字符
 * @param {*} c1 字符1
 * @param {*} c2 字符2
 */
function Range(c1, c2)
{
    this.c1 = c1;
    this.c2 = c2;
}
makeParser(Range, function(input)
{
    if (input == "") return null;
    var v1 = this.c1.charCodeAt(0);
    var v2 = this.c2.charCodeAt(0);
    var v = input[0].charCodeAt(0);
    if ((v1 - v) * (v2 - v) > 0) return null;
    var result = input[0];
    var remain = input.substring(1);
    return [result, remain];
});

/**
 * 解析字符串常量
 * @param {*} str 字符串
 */
function Literal(str)
{
    this.str = str;
}
makeParser(Literal, function(input)
{
    for (var i = 0; i < this.str.length; ++i)
    {
        if (i >= input.length) return null;
        if (this.str[i] != input[i]) return null;
    }
    var result = this.str;
    var remain = input.substring(this.str.length);
    return [result, remain];
});

/**
 * 依次应用两个解析器
 * @param {*} p1 解析器1
 * @param {*} p2 解析器2
 */
function Concat(p1, p2)
{
    this.p1 = p1;
    this.p2 = p2;
}
makeParser(Concat, function(input)
{
    var r1 = this.p1.parse(input);
    if (r1 == null) return null;
    var r2 = this.p2.parse(r1[1]);
    if (r2 == null) return null;
    var result = [r1[0], r2[0]];
    var remain = r2[1];
    return [result, remain];
});

/**
 * 应用两个解析器中的其中一个
 * 如果p1解析成功，则不会应用p2
 * @param {*} p1 解析器1
 * @param {*} p2 解析器2
 */
function Or(p1, p2)
{
    this.p1 = p1;
    this.p2 = p2;
}
makeParser(Or, function(input)
{
    var r = this.p1.parse(input);
	if (r != null) return r;
	return this.p2.parse(input);
});

/**
 * 应用指定解析器零次或多次
 * @param {*} p 解析器
 */
function ZeroOrMore(p)
{
    this.p = p;
}
makeParser(ZeroOrMore, function(input)
{
    var r = this.p.parse(input);
    var result = [];
    var remain = input;
    while (r != null)
    {
        result.push(r[0]);
        remain = r[1];
        r = this.p.parse(r[1]);
    }
    return [result, remain];
});

/**
 * 应用指定解析器一次或多次
 * @param {*} p 解析器
 */
function OneOrMore(p)
{
    this.p = p;
}
makeParser(OneOrMore, function(input)
{
    var r = this.p.parse(input);
    if (r == null) return null;
    var result = [];
    var remain = "";
    while (r != null)
    {
        result.push(r[0]);
        remain = r[1];
        r = this.p.parse(r[1]);
    }
    return [result, remain];
});

/**
 * 对解析结果进行转换
 * @param {*} p 解析器
 * @param {*} handler 转换函数
 */
function Transform(p, handler)
{
    this.p = p;
    this.handler = handler;
}
makeParser(Transform, function(input)
{
    var r = this.p.parse(input);
	if (r == null) return null;
	return [this.handler(r[0]), r[1]];
});

/**
 * 依次应用两个解析器，并丢弃第二个解析器的解析结果
 * @param {*} p1 解析器1
 * @param {*} p2 解析器2
 */
function SkipSecond(p1, p2)
{
    this.p1 = p1;
    this.p2 = p2;
}
makeParser(SkipSecond, function(input)
{
    var r1 = this.p1.parse(input);
    if (r1 == null) return null;
    var r2 = this.p2.parse(r1[1]);
    if (r2 == null) return null;
    var result = r1[0];
    var remain = r2[1];
    return [result, remain];
});

/**
 * 依次应用两个解析器，并丢弃第一个解析器的解析结果
 * @param {*} p1 解析器1
 * @param {*} p2 解析器2
 */
function SkipFirst(p1, p2)
{
    this.p1 = p1;
    this.p2 = p2;
}
makeParser(SkipFirst, function(input)
{
    var r1 = this.p1.parse(input);
    if (r1 == null) return null;
    var r2 = this.p2.parse(r1[1]);
    if (r2 == null) return null;
    var result = r2[0];
    var remain = r2[1];
    return [result, remain];
});

export { Parser, createParser, Empty, empty, Char, char, satisfy, Range, range, Literal, literal, Concat, Or, ZeroOrMore, Transform, skip };