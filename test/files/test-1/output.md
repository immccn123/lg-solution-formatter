在阅读本题解之前你需要知道 C++ 模板编程中仿函数 / 函数对象（是一个东西）的概念。建议在学会普通快速幂之后再来看本文章。

可能不太众所周知地，`libstdc++` 在 `<ext/numeric>` 提供了一个 `__gnu_cxx::power` 函数。看[实现](https://gcc.gnu.org/onlinedocs/gcc-9.5.0/libstdc++/api/a18031_source.html)应该是一个快速幂的形状。然而截至 GCC 14.2 这东西现在还没有文档，但是这并不意味着我们就不会用这个东西了。

[libstdc++ reference](https://gcc.gnu.org/onlinedocs/gcc-9.5.0/libstdc++/api/a01468.html#ga2a1a321e469c0cafa50d1085b27ebbc3)

这个函数的声明长这样：

```cpp
template<typename _Tp, typename _Integer, typename _MonoidOperation>
  inline _Tp
  power(_Tp __x, _Integer __n, _MonoidOperation __monoid_op)
  { return __power(__x, __n, __monoid_op); }
```

`__monoid_op` 需要传进去就是需要实现一个有结合律、有单位元（一个值，满足**任何值与单位元进行 `__monoid_op` 运算后不变**的性质）的运算。

仔细观察 `__power` 的实现，第一行为

```cpp
if (__n == 0) return identity_element(__monoid_op);
```

转到 `identity_element` 函数的声明：

```cpp
/// An \link SGIextensions SGI extension \endlink.
template <class _Tp>
  inline _Tp identity_element(std::multiplies<_Tp>) { return _Tp(1); }
```

我们可以发现这个东西得重载然后返回这组运算的单位元。因此我们可以通过新建一个类型并重载括号运算符的方式来实现这一操作。

```cpp
#include <iostream>
#include <ext/numeric>
using ll = long long;
using namespace std;
using __gnu_cxx::power;
ll MODN;

// 需要定义一个仿函数类型才能正常使用
struct modmul_op {
	inline const ll operator()(ll a, ll b) { return a * b % MODN; }
};

// 你需要对这个函数进行重载以返回单位元
inline ll identity_element(modmul_op) { return 1; }

int main()
{
	ll base, exp;
	cin >> base >> exp >> MODN;
	cout << base << "^" << exp << " mod " << MODN << "=" << power(base, exp, modmul_op {});
}
```
