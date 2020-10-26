/**
 * 表达式求值
 * https://www.lintcode.com/problem/expression-evaluation/description
 */

import { createParser, range, literal, skip } from "../parserc.js";

function charToInteger(r)
{
	return r.charCodeAt(0) - "0".charCodeAt(0);
}

function arrayToInteger(r)
{
	var val = r[0];
	for (var i = 0; i < r[1].length; ++i)
	{
		val = val * 10 + r[1][i];
	}
	return val;
}

function calc(r)
{
	var sum = r[0];
	for (var i = 0; i < r[1].length; ++i)
	{
		if (r[1][i][0] == "+")
			sum += r[1][i][1];
		else if (r[1][i][0] == "-")
			sum -= r[1][i][1];
		else if (r[1][i][0] == "*")
			sum *= r[1][i][1];
		else if (r[1][i][0] == "/")
			sum = Math.floor(sum / r[1][i][1]);
	}
	return sum;
}

var d = createParser();
var i = createParser();
var f = createParser();
var t = createParser();
var e = createParser();

d.set(range("0", "9").transform(charToInteger));
i.set(d.concat(d.zeroOrMore()).transform(arrayToInteger));
f.set(i.or(skip(literal("(")).concat(e).skip(literal(")"))));
t.set(f.concat(literal("*").or(literal("/")).concat(f).zeroOrMore()).transform(calc));
e.set(t.concat(literal("+").or(literal("-")).concat(t).zeroOrMore()).transform(calc));

var r = e.parse("2*6-(23+7)/(1+2)");
if (r == null || r[1] != "") 
	console.log("语法错误");
else 
	console.log("计算结果：" + r[0]);