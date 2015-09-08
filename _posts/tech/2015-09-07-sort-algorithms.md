---
layout: post
title: 七种常见经典排序算法总结（C++实现）
category: 技术
tags: 算法
keywords: 算法,排序,Sort,Algorithm
---

排序算法是非常常见也非常基础的算法，以至于大部分情况下它们都被集成到了语言的辅助库中。排序算法虽然已经可以很方便的使用，但是理解排序算法可以帮助我们找到解题的方向。

## 1. 冒泡排序 (Bubble Sort)

冒泡排序是最简单粗暴的排序方法之一。它的原理很简单，每次从左到右两两比较，把大的交换到后面，每次可以确保将前M个元素的最大值移动到最右边。

**步骤**

1. 从左开始比较相邻的两个元素x和y，如果 x > y 就交换两者
2. 执行比较和交换，直到到达数组的最后一个元素
3. 重复执行1和2，直到执行n次，也就是n个最大元素都排到了最后

```CPP
void bubble_sort(vector<int> &nums)
{
    for (int i = 0; i < nums.size() - 1; i++) { // times
        for (int j = 0; j < nums.size() - i - 1; j++) { // position
            if (nums[j] > nums[j + 1]) {
                int temp = nums[j];
                nums[j] = nums[j + 1];
                nums[j + 1] = temp;
            }
        }
    }
}
```

交换的那一步可以不借助temp，方法是

```CPP
nums[j] += nums[j + 1];
nums[j + 1] = num[j] - nums[j + 1];
nums[j] -= num[j + 1];
```

**复杂度分析**

由于我们要重复执行n次冒泡，每次冒泡要执行n次比较（实际是1到n的等差数列，也就是`(a1 + an) * n / 2`），也就是 `O(n^2)`。 空间复杂度是`O(n)`。

## 2. 插入排序（Insertion Sort）

插入排序的原理是从左到右，把选出的一个数和前面的数进行比较，找到最适合它的位置放入，使前面部分有序。

**步骤**

1. 从左开始，选出当前位置的数x，和它之前的数y比较，如果x < y则交换两者
2. 对x之前的数都执行1步骤，直到前面的数字都有序
3. 选择有序部分后一个数字，插入到前面有序部分，直到没有数字可选择

```CPP
void insert_sort(vector<int> &nums)
{
    for (int i = 1; i < nums.size(); i++) { // position
        for (int j = i; j > 0; j--) {
            if (nums[j] < nums[j - 1]) {
                int temp = nums[j];
                nums[j] = nums[j - 1];
                nums[j - 1] = temp;
            }
        }
    }
}
```

**复杂度分析**

因为要选择n次，而且插入时最坏要比较n次，所以时间复杂度同样是`O(n^2)`。空间复杂度是`O(n)`。

## 3. 选择排序（Selection Sort）

选择排序的原理是，每次都从乱序数组中找到最大（最小）值，放到当前乱序数组头部，最终使数组有序。

**步骤**

1. 从左开始，选择后面元素中最小值，和最左元素交换
2. 从当前已交换位置往后执行，直到最后一个元素

```CPP
void selection_sort(vector<int> &nums)
{
    for (int i = 0; i < nums.size(); i++) { // position
        int min = i;
        for (int j = i + 1; j < nums.size(); j++) {
            if (nums[j] < nums[min]) {
                min = j;
            }
        }

        int temp = nums[i];
        nums[i] = nums[min];
        nums[min] = temp;
    }
}
```

**复杂度分析**

每次要找一遍最小值，最坏情况下找n次，这样的过程要执行n次，所以时间复杂度还是`O(n^2)`。空间复杂度是`O(n)`。

## 4. 希尔排序（Shell Sort）

希尔排序从名字上看不出来特点，因为它是以发明者命名的。它的另一个名字是“递减增量排序算法“。这个算法可以看作是插入排序的优化版，因为插入排序需要一位一位比较，然后放置到正确位置。为了提升比较的跨度，希尔排序将数组按照一定步长分成几个子数组进行排序，通过逐渐减短步长来完成最终排序。

**例子**

例如 `[10, 80, 70, 100, 90, 30, 20]`
如果我们按照一次减一半的步长来算， 这个数组第一次排序时以3为步长，子数组是：

`10 80 70`
`90 30 20`
`100`

这里其实按照列划分的4个子数组，排序后结果为

`10 30 20`
`90 80 70`
`100`

也就是 `[10, 30 20 90 80 70 100]`

然后再以1为步长生成子数组

`10`
`30`
`20`
`..`

这个时候就是一纵列了，也就是说最后一定是以一个数组来排序的。

**步骤**

1. 计算当前步长，按步长划分子数组
2. 子数组内插入排序
3. 步长除以2后继续12两步，直到步长最后变成1


```CPP
void shell_sort(vector<int> &nums)
{
    for (int gap = nums.size() >> 1; gap > 0; gap >>= 1) { // times
        for (int i = gap; i < nums.size(); i++) { // position
            int temp = nums[i];

            int j = i - gap;
            for (; j >= 0 && nums[j] > temp; j -= gap) {
                nums[j + gap] = nums[j];
            }

            nums[j + gap] = temp;
        }
    }
}
```

**复杂度分析**

希尔排序的时间复杂度受步长的影响，具体分析在[维基百科](https://zh.wikipedia.org/wiki/%E5%B8%8C%E5%B0%94%E6%8E%92%E5%BA%8F#.E6.AD.A5.E9.95.BF.E5.BA.8F.E5.88.97)。

## 5. 归并排序（Merge Sort）

归并排序是采用分治法（Divide and Conquer）的一个典型例子。这个排序的特点是把一个数组打散成小数组，然后再把小数组拼凑再排序，直到最终数组有序。

**步骤**

1. 把当前数组分化成n个单位为1的子数组，然后两两比较合并成单位为2的n/2个子数组
2. 继续进行这个过程，按照2的倍数进行子数组的比较合并，直到最终数组有序

```CPP
void merge_array(vector<int> &nums, int b, int m, int e, vector<int> &temp)
{
    int lb = b, rb = m, tb = b;
    while (lb != m && rb != e)
        if (nums[lb] < nums[rb])
            temp[tb++] = nums[lb++];
        else
            temp[tb++] = nums[rb++];

    while (lb < m)
        temp[tb++] = nums[lb++];
    
    while (rb < e)
        temp[tb++] = nums[rb++];

    for (int i = b;i < e; i++)
        nums[i] = temp[i];
}

void merge_sort(vector<int> &nums, int b, int e, vector<int> &temp)
{
    int m = (b + e) / 2;
    if (m != b) {
        merge_sort(nums, b, m, temp);
        merge_sort(nums, m, e, temp);
        merge_array(nums, b, m, e, temp);
    }
}
```

这个实现中加了一个temp，是和原数组一样大的一个空间，用来临时存放排序后的子数组的。

**复杂度分析**

在`merge_array`过程中，实际的操作是当前两个子数组的长度，即2m。又因为打散数组是二分的，最终循环执行数是`logn`。所以这个算法最终时间复杂度是`O(nlogn)`，空间复杂度是`O(n)`。

## 6. 快速排序（Quick Sort）

快速排序也是利用分治法实现的一个排序算法。快速排序和归并排序不同，它不是一半一半的分子数组，而是选择一个基准数，把比这个数小的挪到左边，把比这个数大的移到右边。然后不断对左右两部分也执行相同步骤，直到整个数组有序。

**步骤**

1. 用一个基准数将数组分成两个子数组
2. 将大于基准数的移到右边，小于的移到左边
3. 递归的对子数组重复执行1，2，直到整个数组有序

```CPP
void quick_sort(vector<int> &nums, int b, int e, vector<int> &temp)
{
    int m = (b + e) / 2;
    if (m != b) {
        int lb = b, rb = e - 1;

        for (int i = b; i < e; i++) {
            if (i == m)
                continue;
            if (nums[i] < nums[m])
                temp[lb++] = nums[i];
            else
                temp[rb--] = nums[i];
        }
        temp[lb] = nums[m];
        
        for (int i = b; i < e; i++)
            nums[i] = temp[i];
        
        quick_sort(nums, b, lb, temp);
        quick_sort(nums, lb + 1, e, temp);
    }
}
```

解法2: 不需要辅助空间

```CPP
void quick_sort(vector<int> &nums, int b, int e)
{
    if (b < e - 1) {
        int lb = b, rb = e - 1;
        while (lb < rb) {
            while (nums[rb] >= nums[b] && lb < rb)
                rb--;
            while (nums[lb] <= nums[b] && lb < rb)
                lb++;
            swap(nums[lb], nums[rb]);
        }
        swap(nums[b], nums[lb]);
        quick_sort(nums, b, lb);
        quick_sort(nums, lb + 1, e);
    }
}
```

**复杂度分析**

快速排序也是一个不稳定排序，时间复杂度看[维基百科](https://zh.wikipedia.org/wiki/%E5%BF%AB%E9%80%9F%E6%8E%92%E5%BA%8F#.E5.B9.B3.E5.9D.87.E8.A4.87.E9.9B.9C.E5.BA.A6)。空间复杂度是`O(n)`。

## 7. 堆排序（Heap Sort）

堆排序经常用于求一个数组中最大k个元素时。因为堆实际上是一个完全二叉树，所以用它可以用一维数组来表示。因为最大堆的第一位总为当前堆中最大值，所以每次将最大值移除后，调整堆即可获得下一个最大值，通过一遍一遍执行这个过程就可以得到前k大元素，或者使堆有序。

在了解算法之前，首先了解在一维数组中节点的下标：

- i节点的父节点 parent(i) = floor((i-1)/2) 
- i节点的左子节点 left(i) = 2i + 1
- i节点的右子节点 right(i) = 2i + 2

**步骤**

1. 构造最大堆（Build Max Heap）：首先将当前元素放入最大堆下一个位置，然后将此元素依次和它的父节点比较，如果大于父节点就和父节点交换，直到比较到根节点。重复执行到最后一个元素。
2. 最大堆调整（Max Heapify）：调整最大堆即将根节点移除后重新整理堆。整理方法为将根节点和最后一个节点交换，然后把堆看做n-1长度，将当前根节点逐步移动到其应该在的位置。
3. 堆排序（HeapSort）：重复执行2，直到所有根节点都已移除。

```CPP
void heap_sort(vector<int> &nums)
{
    int n = nums.size();
    for (int i = n / 2 - 1; i >= 0; i--) { // build max heap
        max_heapify(nums, i, nums.size() - 1);
    }
    
    for (int i = n - 1; i > 0; i--) { // heap sort
        int temp = nums[i];
        num[i] = nums[0];
        num[0] = temp;
        max_heapify(nums, 0, i);
    }
}

void max_heapify(vector<int> &nums, int beg, int end)
{
    int curr = beg;
    int child = curr * 2 + 1;
    while (child < end) {
        if (child + 1 < end && nums[child] < nums[child + 1]) {
            child++;
        }
        if (nums[curr] < nums[child]) {
            int temp = nums[curr];
            nums[curr] = nums[child];
            num[child] = temp;
            curr = child;
            child = 2 * curr + 1;
        } else {
            break;
        }
    }
}
```

**复杂度分析**

堆执行一次调整需要`O(logn)`的时间，在排序过程中需要遍历所有元素执行堆调整，所以最终时间复杂度是`O(nlogn)`。空间复杂度是`O(n)`。

## 0. 参考

- 维基百科
- [经典排序算法总结与实现](http://wuchong.me/blog/2014/02/09/algorithm-sort-summary/)
- [堆排序C++实现](http://segmentfault.com/a/1190000002466215)
- [常见排序算法 - 堆排序 (Heap Sort)](http://bubkoo.com/2014/01/14/sort-algorithm/heap-sort/)
