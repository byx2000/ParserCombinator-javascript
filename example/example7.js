/**
 * Lisp语法解析
 * https://leetcode-cn.com/problems/parse-lisp-expression/
 */

import { char, createParser, literal, range, skip } from "../parserc.js"

var env = [];

function toPosInt(r)
{
    var val = 0;
    for (var i = 0; i < r.length; ++i)
    {
        val = val * 10 + r[i];
    }
    return val;
}

function toNegInt(r)
{
    var val = 0;
    for (var i = 0; i < r.length; ++i)
    {
        val = val * 10 + r[i];
    }
    return -val;
}

function toId(r)
{
    var id = r[0];
    for (var i = 0; i < r[1].length; ++i)
    {
        id += String(r[1][i]);
    }
    return id;
}

function getIdVal(r)
{
    for (var i = env.length - 1; i >= 0; --i)
    {
        if (r in env[i]) return env[i][r];
    }
    return null;
}

function add(r)
{
    return r[0] + r[1];
}

function mul(r)
{
    return r[0] * r[1];
}

function pushEnv(r)
{
    env.push({});
    return r;
}

function assign(r)
{
    env[env.length - 1][r[0]] = r[1];
    return r;
}

function processLet(r)
{
    env.pop();
    return r[1];
}

var digit = range("0", "9").transform(Number);
var alpha = range("a", "z");
var posInt = digit.oneOrMore().transform(toPosInt);
var negInt = skip(char("-")).concat(digit.oneOrMore().transform(toNegInt));
var id = alpha.concat(alpha.or(digit).zeroOrMore()).transform(toId);
var expr = createParser();
var idExpr = id.transform(getIdVal);
var addExpr = skip(literal("(add ")).concat(expr).skip(literal(" ")).concat(expr).skip(literal(")")).transform(add);
var mulExpr = skip(literal("(mult ")).concat(expr).skip(literal(" ")).concat(expr).skip(literal(")")).transform(mul);
var letExpr = skip(literal("(let ").transform(pushEnv)).concat(id.skip(literal(" ")).concat(expr).skip(literal(" ")).transform(assign).oneOrMore()).concat(expr).skip(literal(")")).transform(processLet);
expr.set(posInt.or(negInt).or(idExpr).or(addExpr).or(mulExpr).or(letExpr));

var r = expr.parse("(let var 78 b 77 (let c 33 (add c (mult var 66))))");
if (r == null || r[1] != "")
    console.log("语法错误");
else
    console.log(r[0]);