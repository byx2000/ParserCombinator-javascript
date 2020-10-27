/**
 * 解析化学式
 * https://leetcode-cn.com/problems/number-of-atoms/
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

function toElementName(r)
{
    var str = r[0];
    for (var i = 0; i < r[1].length; ++i)
    {
        str += r[1][i];
    }
    return str;
}

function toDict1(r)
{
    var obj = {};
    obj[r] = 1;
    return obj;
}

function toDict2(r)
{
    var obj = {};
    obj[r[0]] = r[1];
    return obj;
}

function toDict3(r)
{
    var obj = r[0];
    var count = r[1];
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; ++i)
    {
        obj[keys[i]] *= count;
    }
    return obj;
}

function toDict4(r)
{
    var obj = {};
    for (var i = 0; i < r.length; ++i)
    {
        var keys = Object.keys(r[i]);
        for (var j = 0; j < keys.length; ++j)
        {
            if (keys[j] in obj) obj[keys[j]] += r[i][keys[j]];
            else obj[keys[j]] = r[i][keys[j]];
        }
    }
    return obj;
}

var digit = range("0", "9").transform(charToInteger);
var num = digit.oneOrMore().transform(listToInteger);
var lowerCase = range("a", "z");
var upperCase = range("A", "Z");
var element = upperCase.concat(lowerCase.zeroOrMore()).transform(toElementName);
var expr = createParser();
var term1 = element.concat(num).transform(toDict2);
var term2 = element.transform(toDict1);
var term3 = skip(literal("(")).concat(expr).skip(literal(")")).concat(num).transform(toDict3);
var term4 = skip(literal("(")).concat(expr).skip(literal(")"));
var term = term1.or(term2).or(term3).or(term4);
expr.set(term.oneOrMore().transform(toDict4));

var r = expr.parse("K4(ON(SO3)2)2");
if (r == null || r[1] != "")
    console.log("语法错误");
else
    console.log(r[0]);