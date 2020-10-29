/**
 * 花括号展开
 * https://leetcode-cn.com/problems/brace-expansion-ii/
 */

import { char, createParser, range, skip } from "../parserc.js"

function toList1(r)
{
    return [r];
}

function toList2(r)
{
    var set = new Set();
    for (var e of r[0]) set.add(e);
    for (var e1 of r[1])
    {
        for (var e2 of e1)
        {
            set.add(e2);
        }
    }
    return Array.from(set);
}

function cross(list)
{
    var set = new Set();

    function recur(index, str)
    {
        if (index == list.length)
        {
            set.add(str);
            return;
        }

        for (var i = 0; i < list[index].length; ++i)
        {
            recur(index + 1, str + list[index][i]);
        }
    }

    recur(0, "");
    return Array.from(set).sort();
}

var alpha = range("a", "z");
var expr = createParser();
var term1 = alpha.transform(toList1);
var term2 = skip(char("{")).concat(expr).concat(skip(char(",")).concat(expr).oneOrMore()).skip(char("}")).transform(toList2);
var term = term1.or(term2);
expr.set(term.oneOrMore().transform(cross));

var r = expr.parse("{{a,z},a{b,c},{ab,z}}");
if (r == null || r[1] != "")
    console.log("语法错误");
else
    console.log(r[0]);