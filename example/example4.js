/**
 * 解压字符串
 * https://www.lintcode.com/problem/decrypt-the-string/description
 */

import { createParser, literal, range, skip } from "../parserc.js"

function charToInteger(r)
{
    return Number(r);
}

function listToInteger(r)
{
    var val = 0;
    for (var i = 0; i < r.length; ++i)
    {
        val = val * 10 + r[i];
    }
    return val;
}

function listToString(r)
{
    var str = "";
    for (var i = 0; i < r.length; ++i)
    {
        str += r[i];
    }
    return str;
}

function extract(r)
{
    var count = r[0];
    var str = r[1];
    var res = "";
    for (var i = 0; i < count; ++i)
    {
        res += str;
    }
    return res;
}

var alpha = range("A", "Z");
var word = alpha.oneOrMore().transform(listToString);
var digit = range("0", "9").transform(charToInteger);
var num = digit.oneOrMore().transform(listToInteger);
var expr = createParser();
var expr1 = word;
var expr2 = skip(literal("[")).concat(num).skip(literal("|")).concat(expr).skip(literal("]")).transform(extract);
expr.set(expr1.or(expr2).oneOrMore().transform(listToString));

var r = expr.parse("HG[3|B[2|CA]]F");
if (r == null || r[1] != "")
    console.log("语法错误");
else
    console.log(r[0]);