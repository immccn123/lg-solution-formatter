题意：有一个 $n \times n$ 的 01 矩阵。每次操作可选择一个元素 $(i, j)$，将自己及满足条件的元素反转，即反转 $(x, y)$ 满足 $x > i$ 且 $x - i \ge \left|y - j\right|$。求使整个矩阵变为全 $0$ 所需的最少操作次数。

这个题目条件不是很直观，画一下会明显一些。如对点 $(1, 2)$ 进行操作：

![](https://cdn.luogu.com.cn/upload/image_hosting/fdv94528.png)

（红线上及以下的点会被翻转）

考虑一个非常暴力的做法，即从上往下从左往右遍历，找到 $1$ 就对这个点进行操作，这样的操作次数一定是最小的。

然后考虑对暴力进行优化。可以想到使用懒标记优化每次操作。打三个懒标记，意义分别为翻转左下方、翻转正下方、翻转右下方。

剩下的看代码，我说的没代码清楚。

```cpp
inline void pushdown(int x, int y)
{
	if (mp[x][y].ltag) {
		mp[x + 1][y - 1].ltag ^= 1;
		mp[x + 1][y - 1].dtag ^= 1;
		mp[x + 1][y - 1].val ^= 1;
		mp[x][y].ltag = 0;
	}
	if (mp[x][y].rtag) {
		mp[x + 1][y + 1].rtag ^= 1;
		mp[x + 1][y + 1].dtag ^= 1;
		mp[x + 1][y + 1].val ^= 1;
		mp[x][y].rtag = 0;
	}
	if (mp[x][y].dtag) {
		mp[x + 1][y].dtag ^= 1;
		mp[x + 1][y].val ^= 1;
		mp[x][y].dtag = 0;
	}
}

inline void solve()
{
	// ...
	for (int i = 1; i <= n; i++) {
		for (int j = 1; j <= n; j++) {
			if (mp[i][j].val == 1) {
				ans++;
				// 关于这个地方正确性的说明：pushdown 时，dtag 会被更新三次，等价于更新一次
				mp[i][j].ltag ^= 1;
				mp[i][j].rtag ^= 1;
				mp[i][j].dtag ^= 1;
			}
			pushdown(i, j);
		}
	}
	// ...
}
```

[CF Link](https://codeforces.com/contest/1862/problem/G)|[Luogu Link](https://www.luogu.com.cn/problem/CF1862G)

[Blog](https://blog.immccn123.xyz/archives/532)可能观感更佳。

昨天比赛写的一道非常有意思的题，完赛前 $5$ 分钟想出的解法（然后没写出来）。

主要讲的是找规律，然后没有很严谨的数学证明。

## 题意

定义一个对序列的操作为：

1. 升序排序+去重
2. 如果只剩一个元素就返回这个元素
3. 将所有元素 $a_i$（下标从 $0$ 开始）加上 $n - i$，并回到步骤 $1$。

## 解法

结果$=$原序列最大值$+$排序后某连续两个数的差值

比方说，拿 $[1, 6, 10] \to 15$ 举例：$ 15 = 10 + (6 - 1) $


```cpp
void bruteforce()
{
	int n = 3;
	vector<int> arr(n);
	for (auto &x : arr) cin >> x;
	while (arr.size()) {
		sort(arr.begin(), arr.end());
		arr.erase(unique(arr.begin(), arr.end()), arr.end());
		if (arr.size() == 1) {
			cout << arr[0] << endl;
			return;
		}
		for (int i = 0; i < arr.size(); i++) {
			arr[i] += n - i;
		}
	}
}
```

手构几组数据，应该不难看出，这个差值是*最大的连续两个数的差值*。

这个时候解法就出来了。可以用一个multiset维护序列内的数值（可以通过寻找前驱/后继来动态更新排序后相邻元素的差值），再用另一个multiset维护排序后相邻元素的差值。

修改时具体操作捋一下，就几个：

1. 从维护数值的multiset里寻找到旧的$x$的前驱和后继；
2. 从维护差值的multiset里删除旧的$x$和它的前驱/后继的差值，插入其前驱与后继的差；
3. 删除旧的$x$，插入新的$x$；
4. 在维护差值的multiset里插入新的$x$与它前驱/后继的差值，删除前驱后继的差。


**Bold*和斜体***

| Title | content |
