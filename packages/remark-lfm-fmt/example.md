仔细分析一下 $\operatorname{MEX}$，大概是不难发现下列性质的：

- 任意 $n$ 个数字的 $\operatorname{MEX}$ 不大于 $n$。

因此，我们可以维护一个 `set`，里面只用维护 $0\sim n$ 里面**没有出现**的数字，大于 $n$ 的直接忽略即可；每次查询的时候输出这个 `set` 里面最小元素的值就行了。

具体请参见代码：

```cpp
using ll = long long;

set<ll> st;

ll nc[200015];
ll cnt[200015];
int n, q;

int x;
ll val;

// 这里用一个较大的值作为上界是因为赛时没有想清楚边界
// 其实深入想一下发现其实并不影响
const int MAXN = 2e5 + 10;

int main()
{
	cin >> n >> q;
	for (int i = 0; i <= MAXN; i++)
		st.insert(i);

	for (int i = 1; i <= n; i++) {
		cin >> nc[i];
		if (nc[i] <= MAXN) {
			st.erase(nc[i]);
			cnt[nc[i]]++;
		}
	}
	while (q--) {
		cin >> x >> val;
		if (nc[x] <= MAXN) {
			cnt[nc[x]]--;
			if (cnt[nc[x]] == 0)
				st.insert(nc[x]);
		}
		nc[x] = val;
		if (val <= MAXN) {
			if (cnt[val] == 0)
				st.erase(val);
			cnt[val]++;
		}
		cout << *st.begin() << '\n';
	}
}
```
