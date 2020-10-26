/**
 * 布尔表达式求值
 * https://leetcode-cn.com/problems/parsing-a-boolean-expression/
 */

import { createParser, literal, skip } from "../parserc.js"

function charToBool(r)
{
    return r == "t";
}

function calcNot(r)
{
    return !r[1];
}

function calcAndOr(r)
{
    var op = r[0];
    var list = r[1];
    var res = list[0];
    for (var i = 0; i < list[1].length; ++i)
    {
        if (op == "&") res = res && list[1][i];
        else if (op == "|") res = res || list[1][i];
    }
    return res;
}

var e = createParser();
var e1 = createParser();
var e2 = createParser();
var e3 = createParser();
var e4 = createParser();
var e5 = createParser();

e1.set(literal("t").transform(charToBool));
e2.set(literal("f").transform(charToBool));
e3.set(literal("!").skip(literal("(")).concat(e).skip(literal(")")).transform(calcNot));
e4.set(literal("&").skip(literal("(")).concat(e.concat(skip(literal(",")).concat(e).zeroOrMore())).skip(literal(")")).transform(calcAndOr));
e5.set(literal("|").skip(literal("(")).concat(e.concat(skip(literal(",")).concat(e).zeroOrMore())).skip(literal(")")).transform(calcAndOr));
e.set(e1.or(e2).or(e3).or(e4).or(e5));

var r = e.parse("|(&(t,f,t),!(t))");

if (r == null || r[1] != "") 
	console.log("语法错误");
else 
	console.log("计算结果：" + r[0]);