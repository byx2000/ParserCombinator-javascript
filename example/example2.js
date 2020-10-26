/**
 * 括号匹配检测
 * https://leetcode-cn.com/problems/valid-parentheses/
 */

import { createParser, literal, empty } from "../parserc.js"

var s = createParser();
var t = createParser();
var t1 = createParser();
var t2 = createParser();
var t3 = createParser();

t1.set(literal("(").concat(s).concat(literal(")")));
t2.set(literal("[").concat(s).concat(literal("]")));
t3.set(literal("{").concat(s).concat(literal("}")));
t.set(t1.or(t2).or(t3));
s.set(t.concat(s).or(empty()));

var r = s.parse("()");
if (r != null && r[1] == "")
    console.log("括号序列合法");
else
    console.log("括号序列不合法");