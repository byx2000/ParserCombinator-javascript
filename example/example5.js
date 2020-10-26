/**
 * 字符串解码
 * https://leetcode-cn.com/problems/decode-string/
 */

import { createParser, literal, range, satisfy } from "../parserc.js"

function notDigitAndBracket(ch)
{
    var code = ch.charCodeAt(0);
    return (code < "0".charCodeAt(0) || code > "9".charCodeAt(0))
            && ch[0] != "[" && ch[0] != "]";
}

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

var digit = range("0", "9").transform(charToInteger);
var num = digit.oneOrMore().transform(listToInteger);
var alpha = satisfy(notDigitAndBracket);
var word = alpha.oneOrMore().transform(listToString);
var e = createParser();
var e1 = num.skip(literal("[")).concat(e).skip(literal("]")).transform(extract);
e.set(word.or(e1).oneOrMore().transform(listToString));

var r = e.parse("2[abc]3[cd]ef");
if (r == null || r[1] != "")
    console.log("语法错误");
else
    console.log(r[0]);