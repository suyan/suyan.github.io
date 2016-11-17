---
layout: post
title: Airbnb Boggle Game
category: 面试
tags: Airbnb,Interview
keywords: Airbnb,Interview,Boogle Game
---

题目来源: [http://www.1point3acres.com/bbs/thread-204884-1-1.html](http://www.1point3acres.com/bbs/thread-204884-1-1.html)

## 描述

boggle game，给一个board和字典，找出board上出现最多的单词集合，单词不能重叠在同一个位置

例如

```
board:
{'a', 'b', 'c'},
{'d', 'e', 'f'},
{'g', 'h', 'i'}

dict:
["abc", "cfi", "beh", "defi", "gh"]
```

答案应该是 `["abc", "defi", "gh"]`

## 分析

这个题和 Leetcode 的 Word Search II 有点像，唯一区别是这个题里面 board 上的单词不可以重复利用。刚开始我觉得可以 run 一次 Word Search II 得到所有的可能单词先，然后求最大的一个单词无重合集合，但是找无重合集合这个又变成一个 subset 的题目（我没有研究更快的方法）。所以最后还是考虑用控制一下递归搜索的条件，在找单词的时候记录一下已经选中的单词，只是这个过程需要两层递归。

1. 还是用一个 Trie 来加速 Word 的查找
2. 第一个循环，遍历 board 上每一个点，然后从这里找第一个单词（因为第一个单词的选择会影响最终单词数量），开始第一个递归。
3. 第一个递归的作用是，从当前点开始，通过第二个递归拿到当前点可行的每一个单词。挨个放入，每放入一个更新当前 board 的使用情况，然后开始下一层搜索。
4. 第二个递归的作用是，从当前点开始，找所有可行的单词 indexes，为第一个递归提供选择


## Java解答

```java
import java.util.*;
class Untitled {
    // 从每个点开始，找从这个点出发的所有单词组合
    public void getAllWords(char[][] board, String[] words) {
        // 构建字典树加速查找
        Trie trie = new Trie();
        for(String word : words) {
            trie.insert(word);
        }

        int m = board.length;
        int n = board[0].length;
        List<String> result = new ArrayList<>();
        // 每个点作为起点，可能会有不一样的结果
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                boolean[][] visited = new boolean[m][n];
                List<String> path = new ArrayList<>();
                findWords(result, board, visited, path, i, j, trie.root);
            }
        }

        System.out.println(result);
    }

    // 从i,j开始递归找到所有单词组合
    public void findWords(List<String> result, char[][] board, boolean[][] visited, List<String> words, int x, int y, TrieNode root) {

        int m = board.length;
        int n = board[0].length;
        for (int i = x; i < m; i++) {
            for (int j = y; j < n; j++) {
                List<List<Integer>> nextWordIndexes = new ArrayList<>();
                List<Integer> path = new ArrayList<>();
                // 获得从当前点开始的所有可能单词的indexes
                getNextWords(nextWordIndexes, board, visited, path, i, j, root);
                for (List<Integer> indexes : nextWordIndexes) {
                    // 设置visited为当前使用单词
                    String word = "";
                    for (int index : indexes) {
                        int row = index / n;
                        int col = index % n;
                        visited[row][col] = true;
                        word += board[row][col];
                    }

                    words.add(word);
                    // 只要更新了words，就保存一次words
                    if (words.size() > result.size()) {
                        result.clear();
                        result.addAll(words);
                    }
                    findWords(result, board, visited, words, i, j, root);

                    // 恢复visited
                    for (int index : indexes) {
                        int row = index / n;
                        int col = index % n;
                        visited[row][col] = false;
                    }
                    words.remove(words.size() - 1);
                }
            }
            // 只有第x行是从y开始，后面都从0开始
            y = 0;
        }
    }

    private void getNextWords(List<List<Integer>> words, char[][] board, boolean[][] visited, List<Integer> path, int i, int j, TrieNode root) {
        if(i < 0 | i >= board.length || j < 0 || j >= board[0].length
            || visited[i][j] == true || root.children[board[i][j] - 'a'] == null) {
            return;
        }

        root = root.children[board[i][j] - 'a'];
        if(root.isWord) {
            List<Integer> newPath = new ArrayList<>(path);
            newPath.add(i * board[0].length + j);
            words.add(newPath);
            return;
        }

        visited[i][j] = true;
        path.add(i * board[0].length + j);
        getNextWords(words, board, visited, path, i + 1, j, root);
        getNextWords(words, board, visited, path, i - 1, j, root);
        getNextWords(words, board, visited, path, i, j + 1, root);
        getNextWords(words, board, visited, path, i, j - 1, root);
        path.remove(path.size() - 1);
        visited[i][j] = false;
    }

    class Trie {
        TrieNode root;

        Trie() {
            root = new TrieNode('0');
        }

        public void insert(String word) {
            if(word == null || word.length() == 0) {
                return;
            }
            TrieNode node = root;
            for(int i = 0; i < word.length(); i++) {
                char ch = word.charAt(i);
                if(node.children[ch - 'a'] == null) {
                    node.children[ch - 'a'] = new TrieNode(ch);
                }
                node = node.children[ch - 'a'];
            }
            node.isWord = true;
        }
    }

    class TrieNode {
        char value;
        boolean isWord;
        TrieNode[] children;

        TrieNode(char v) {
            value = v;
            isWord = false;
            children = new TrieNode[26];
        }
    }

    public static void main(String[] args) {
        char[][] board = new char[][]{
            {'a', 'b', 'c'},
            {'d', 'e', 'f'},
            {'g', 'h', 'i'}
        };
        String[] words = new String[] {
            "abc", "cfi", "beh", "defi", "gh"
        };

        Untitled s = new Untitled();
        s.getAllWords(board, words);
    }
}
```


