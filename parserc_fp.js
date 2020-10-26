function char(ch)
{
	return [function (input)
	{
		if (input == "") return [null, input];
		if (input[0] != ch) return [null, input];
		var result = input[0]
		var remain = input.substring(1);
		return [result, remain];
	}];
}

function range(c1, c2)
{
	return [function (input)
	{
		if (input == "") return [null, input];
		var v1 = c1.charCodeAt(0);
		var v2 = c2.charCodeAt(0);
		var v = input[0].charCodeAt(0);
		if ((v1 - v) * (v2 - v) > 0) return [null, input];
		var result = input[0];
		var remain = input.substring(1);
		return [result, remain];
	}];
}

function concat(p1, p2)
{
	return [function (input)
	{
		var r1 = p1[0](input);
		if (r1[0] == null) return [null, input];
		var r2 = p2[0](r1[1]);
		if (r2[0] == null) return [null, input];
		var result = [r1[0], r2[0]];
		var remain = r2[1];
		return [result, remain];
	}];
}

function or(p1, p2)
{
	return [function (input)
	{
		var r = p1[0](input);
		if (r[0] != null) return r;
		return p2[0](input);
	}];
}

function zeroOrMore(p)
{
	return [function (input)
	{
		var r = p[0](input);
		var rs = [];
		while (r[0] != null)
		{
			rs.push(r[0]);
			r = p[0](r[1]);
		}
		return [rs, r[1]];
	}];
}

function transform(p, handler)
{
	return [function (input)
	{
		var r = p[0](input);
		if (r[0] == null) return r;
		return [handler(r[0]), r[1]];
	}];
}

function createParser()
{
	return [null];
}

function setParser(obj, p)
{
	obj[0] = p[0];
}

function parse(p, input)
{
	return p[0](input);
}

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

function removeParentheses(r)
{
	return r[1][0];
}

var d = createParser();
var i = createParser();
var f = createParser();
var t = createParser();
var e = createParser();
setParser(d, transform(range("0", "9"), charToInteger));
setParser(i, transform(concat(d, zeroOrMore(d)), arrayToInteger));
setParser(f, or(i, transform(concat(char("("), concat(e, char(")"))), removeParentheses)));
setParser(t, transform(concat(f, zeroOrMore(concat(or(char("*"), char("/")), f))), calc));
setParser(e, transform(concat(t, zeroOrMore(concat(or(char("+"), char("-")), t))), calc))
var r = parse(e, "(1+2)*(3+4)+5");
console.log("result:", r[0]);
console.log("remain:", r[1]);