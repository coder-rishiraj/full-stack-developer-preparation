/**
 * C++17 solutions for the graph-algorithm topics that are NOT covered by
 * `_graph-core-cpp.ts`. Same topicIds, same problem intent and the same
 * semantics as the Java solutions in `_graph-algo-pack-extra.ts` and
 * `_graph-reference-pack.ts`, written as idiomatic competitive-programming C++.
 */

export type AlgoCppSolution = {
  caption: string
  code: string
}

/* ------------------------------------------------------------------ */
/* Representations                                                     */
/* ------------------------------------------------------------------ */

const GRAPH_REP_CPP = `#include <bits/stdc++.h>
using namespace std;

struct Edge {
    int u, v, w;
};

// Sparse graphs (E far below V^2) want an adjacency list: O(V+E) memory and
// traversals that touch only real edges.
vector<vector<int>> toAdjacencyList(int V, const vector<vector<int>>& edges, bool directed) {
    vector<vector<int>> adj(V);
    for (const auto& e : edges) {
        adj[e[0]].push_back(e[1]);
        // An undirected edge must be stored in BOTH rows, otherwise a traversal
        // can only ever cross it in one direction.
        if (!directed) adj[e[1]].push_back(e[0]);
    }
    return adj;
}

// Dense graphs, or any workload dominated by "is u-v an edge?", want a matrix.
vector<vector<int>> toMatrix(int V, const vector<vector<int>>& edges, bool directed, int noEdge) {
    vector<vector<int>> g(V, vector<int>(V, noEdge));
    // Zero diagonal: a vertex reaches itself at cost 0, which is what
    // Floyd-Warshall and transitive closure assume on entry.
    for (int i = 0; i < V; ++i) g[i][i] = 0;
    for (const auto& e : edges) {
        int w = e.size() > 2 ? e[2] : 1;
        g[e[0]][e[1]] = w;
        if (!directed) g[e[1]][e[0]] = w;
    }
    return g;
}

// Edge-driven algorithms (Kruskal sorts them, Bellman-Ford sweeps them) never
// need adjacency at all, so keep the flat array.
vector<Edge> toEdgeList(const vector<vector<int>>& edges) {
    vector<Edge> out;
    out.reserve(edges.size());
    for (const auto& e : edges) out.push_back({e[0], e[1], e.size() > 2 ? e[2] : 1});
    return out;
}`

const ADJ_LIST_CPP = `#include <bits/stdc++.h>
using namespace std;

vector<vector<int>> buildAdjacencyList(int V, const vector<pair<int, int>>& edges, bool directed) {
    vector<vector<int>> adj(V);
    for (const auto& e : edges) {
        adj[e.first].push_back(e.second);
        // Undirected edges are stored twice, so the row count is 2E and every
        // BFS/DFS cost bound of O(V+E) already accounts for the duplication.
        if (!directed) adj[e.second].push_back(e.first);
    }
    return adj;
}

// O(deg(u)) membership test. Sort each row once if edge queries are frequent,
// or switch to a matrix — a list is the wrong shape for random edge lookups.
bool hasEdge(const vector<vector<int>>& adj, int u, int v) {
    return find(adj[u].begin(), adj[u].end(), v) != adj[u].end();
}

// Sorting rows enables binary search and makes neighbour order deterministic,
// which matters when a problem asks for lexicographically smallest output.
void sortRows(vector<vector<int>>& adj) {
    for (auto& row : adj) sort(row.begin(), row.end());
}

int degree(const vector<vector<int>>& adj, int u) {
    return (int)adj[u].size();
}`

const ADJ_MATRIX_CPP = `#include <bits/stdc++.h>
using namespace std;

// Theta(V^2) memory regardless of edge count: the price paid for O(1) queries.
vector<vector<char>> buildAdjacencyMatrix(int V, const vector<pair<int, int>>& edges, bool directed) {
    vector<vector<char>> g(V, vector<char>(V, 0));
    for (const auto& e : edges) {
        g[e.first][e.second] = 1;
        // A symmetric matrix is exactly the definition of an undirected graph.
        if (!directed) g[e.second][e.first] = 1;
    }
    return g;
}

bool hasEdge(const vector<vector<char>>& g, int u, int v) {
    return g[u][v] != 0;   // single array read: the reason dense algorithms like this layout
}

// Enumerating neighbours costs O(V) even for a degree-1 vertex, so a plain BFS
// over a matrix degrades to O(V^2) instead of O(V+E).
vector<int> neighbors(const vector<vector<char>>& g, int u) {
    vector<int> out;
    for (int v = 0; v < (int)g.size(); ++v) {
        if (g[u][v]) out.push_back(v);
    }
    return out;
}

// Weighted variant: noEdge acts as "infinity" for Floyd-Warshall style DP.
vector<vector<int>> buildWeightedMatrix(int V, const vector<vector<int>>& edges,
                                        bool directed, int noEdge) {
    vector<vector<int>> g(V, vector<int>(V, noEdge));
    for (int i = 0; i < V; ++i) g[i][i] = 0;
    for (const auto& e : edges) {
        // Keep the cheapest copy when the input contains parallel edges.
        g[e[0]][e[1]] = min(g[e[0]][e[1]], e[2]);
        if (!directed) g[e[1]][e[0]] = min(g[e[1]][e[0]], e[2]);
    }
    return g;
}`

const EDGE_LIST_CPP = `#include <bits/stdc++.h>
using namespace std;

struct Edge {
    int u, v, w;
};

vector<Edge> buildEdgeList(const vector<vector<int>>& raw) {
    vector<Edge> edges;
    edges.reserve(raw.size());
    // A missing third column means "unweighted", which we model as weight 1 so
    // weight-driven algorithms still work on the same input format.
    for (const auto& e : raw) edges.push_back({e[0], e[1], e.size() > 2 ? e[2] : 1});
    return edges;
}

// Kruskal only ever needs edges in nondecreasing weight order — no adjacency.
void sortByWeight(vector<Edge>& edges) {
    sort(edges.begin(), edges.end(), [](const Edge& a, const Edge& b) { return a.w < b.w; });
}

// Bellman-Ford sweeps this flat array V-1 times; the relaxation order does not
// affect correctness, only how quickly the fixed point is reached.
long long totalWeight(const vector<Edge>& edges) {
    long long sum = 0;
    for (const Edge& e : edges) sum += e.w;
    return sum;
}

// Materialise adjacency only when a traversal actually needs it.
vector<vector<pair<int, int>>> toAdjacency(int V, const vector<Edge>& edges, bool directed) {
    vector<vector<pair<int, int>>> adj(V);
    for (const Edge& e : edges) {
        adj[e.u].push_back({e.v, e.w});
        if (!directed) adj[e.v].push_back({e.u, e.w});
    }
    return adj;
}`

const TRANSITIVE_CPP = `#include <bits/stdc++.h>
using namespace std;

// reach[i][j] starts as the direct edge i->j. Set reach[i][i] = 1 beforehand if
// you want the reflexive closure. The matrix is rewritten in place.
vector<vector<char>> transitiveClosure(vector<vector<char>> reach) {
    int n = (int)reach.size();
    // Warshall's boolean DP. k must be OUTERMOST: layer k means "paths whose
    // intermediate vertices are all drawn from {0..k}". Any other loop order
    // uses half-finished values and silently loses reachable pairs.
    for (int k = 0; k < n; ++k) {
        for (int i = 0; i < n; ++i) {
            // If i cannot reach k, then no j gains anything from this k. Skipping
            // the whole row is the single biggest constant-factor win here.
            if (!reach[i][k]) continue;
            for (int j = 0; j < n; ++j) {
                if (reach[k][j]) reach[i][j] = 1;   // i->k plus k->j implies i->j
            }
        }
    }
    return reach;
}

bool canReach(const vector<vector<char>>& closure, int i, int j) {
    return closure[i][j] != 0;
}`

const HAVEL_CPP = `#include <bits/stdc++.h>
using namespace std;

// Havel-Hakimi: can deg[] be the degree sequence of a SIMPLE undirected graph?
// The copy is consumed by the reduction, hence pass-by-value.
bool isGraphicSequence(vector<int> deg) {
    int n = (int)deg.size();
    long long sum = 0;
    for (int d : deg) {
        if (d < 0) return false;
        sum += d;
    }
    // Handshake lemma: the degrees sum to 2E, so an odd total is impossible.
    if (sum % 2 != 0) return false;

    while (true) {
        // Re-sort every round. The reduction theorem is only valid when the
        // largest remaining degree is wired to the NEXT-largest vertices.
        sort(deg.begin(), deg.end(), greater<int>());
        if (deg[0] == 0) return true;          // every demand satisfied
        int k = deg[0];
        if (k >= n) return false;              // needs more distinct neighbours than vertices
        deg[0] = 0;                            // this vertex is now fully connected
        for (int i = 1; i <= k; ++i) {
            // A negative remainder means we were asked for a repeated edge.
            if (--deg[i] < 0) return false;
        }
    }
}

// Same reduction, but records the edges it commits to. Empty result = not graphic.
vector<pair<int, int>> buildFromDegrees(const vector<int>& degrees) {
    int n = (int)degrees.size();
    vector<pair<int, int>> nodes(n);   // {remaining degree, original label}
    for (int i = 0; i < n; ++i) nodes[i] = {degrees[i], i};

    vector<pair<int, int>> edges;
    while (true) {
        sort(nodes.begin(), nodes.end(), greater<pair<int, int>>());
        if (nodes[0].first == 0) return edges;
        int k = nodes[0].first;
        if (k >= n) return {};
        nodes[0].first = 0;
        for (int i = 1; i <= k; ++i) {
            if (--nodes[i].first < 0) return {};
            // Labels, not indices: the sort permutes positions every round.
            edges.push_back({nodes[0].second, nodes[i].second});
        }
    }
}`

/* ------------------------------------------------------------------ */
/* Cloning                                                             */
/* ------------------------------------------------------------------ */

const CLONE_GRAPH_CPP = `#include <bits/stdc++.h>
using namespace std;

struct Node {
    int val;
    vector<Node*> neighbors;
    explicit Node(int v) : val(v) {}
};

// BFS deep copy. The map does double duty: it is the visited set AND the
// original -> clone lookup used to wire the copied edges.
Node* cloneGraph(Node* start) {
    if (start == nullptr) return nullptr;

    unordered_map<Node*, Node*> clones;
    clones[start] = new Node(start->val);

    queue<Node*> q;
    q.push(start);
    while (!q.empty()) {
        Node* u = q.front();
        q.pop();
        for (Node* v : u->neighbors) {
            // Allocate the copy the FIRST time v is seen and never again; without
            // this guard a cycle would allocate nodes forever.
            if (clones.find(v) == clones.end()) {
                clones[v] = new Node(v->val);
                q.push(v);
            }
            // Link clone(u) -> clone(v). The input lists an undirected edge from
            // both ends, so the mirrored link is added when v is dequeued.
            clones[u]->neighbors.push_back(clones[v]);
        }
    }
    return clones[start];
}`

const CLONE_DAG_CPP = `#include <bits/stdc++.h>
using namespace std;

struct DagNode {
    int val;
    vector<DagNode*> next;
    explicit DagNode(int v) : val(v) {}
};

DagNode* cloneDagMemo(DagNode* u, unordered_map<DagNode*, DagNode*>& memo) {
    if (u == nullptr) return nullptr;

    auto it = memo.find(u);
    // A DAG can reach the same node through several paths; returning the existing
    // clone is what keeps the copy a DAG instead of an exponential tree.
    if (it != memo.end()) return it->second;

    DagNode* copy = new DagNode(u->val);
    // Register BEFORE recursing so a diamond (or an accidental cycle) terminates.
    memo[u] = copy;
    for (DagNode* v : u->next) copy->next.push_back(cloneDagMemo(v, memo));
    return copy;
}

DagNode* cloneDag(DagNode* start) {
    unordered_map<DagNode*, DagNode*> memo;
    return cloneDagMemo(start, memo);
}`

/* ------------------------------------------------------------------ */
/* Grids and implicit graphs                                           */
/* ------------------------------------------------------------------ */

const GRID_CPP = `#include <bits/stdc++.h>
using namespace std;

const int D4[4][2] = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
const int D8[8][2] = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}, {1, 1}, {1, -1}, {-1, 1}, {-1, -1}};

// (r, c) -> vertex id. Flattening lets grid problems reuse flat visited/dist
// arrays instead of hashing pairs, which is a large constant-factor win.
inline int cellId(int r, int c, int cols) { return r * cols + c; }

vector<pair<int, int>> gridNeighbors(int r, int c, int rows, int cols,
                                     const vector<vector<char>>& blocked, bool diagonal) {
    vector<pair<int, int>> out;
    int k = diagonal ? 8 : 4;
    for (int i = 0; i < k; ++i) {
        int nr = r + (diagonal ? D8[i][0] : D4[i][0]);
        int nc = c + (diagonal ? D8[i][1] : D4[i][1]);
        // Bounds BEFORE the blocked lookup: reading blocked[nr][nc] first is
        // out-of-range access on every border cell.
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
        if (!blocked.empty() && blocked[nr][nc]) continue;
        out.push_back({nr, nc});
    }
    return out;
}

// Every grid move costs 1, so the implicit graph is unweighted and BFS is exact.
vector<vector<int>> gridBfs(const vector<vector<char>>& blocked, int sr, int sc) {
    int rows = (int)blocked.size(), cols = (int)blocked[0].size();
    vector<vector<int>> dist(rows, vector<int>(cols, -1));   // -1 = unreachable/unseen

    queue<pair<int, int>> q;
    dist[sr][sc] = 0;
    q.push({sr, sc});
    while (!q.empty()) {
        int r = q.front().first, c = q.front().second;
        q.pop();
        for (auto& nb : gridNeighbors(r, c, rows, cols, blocked, false)) {
            if (dist[nb.first][nb.second] != -1) continue;
            // Mark on ENQUEUE: dist doubles as the visited flag, so a cell reachable
            // from two frontier cells is still expanded exactly once.
            dist[nb.first][nb.second] = dist[r][c] + 1;
            q.push(nb);
        }
    }
    return dist;
}`

const FLOOD_CPP = `#include <bits/stdc++.h>
using namespace std;

// Recolour the 4-connected region of (sr, sc) that shares its original colour.
vector<vector<int>> floodFill(vector<vector<int>> image, int sr, int sc, int color) {
    int oldColor = image[sr][sc];
    // Without this guard the "already the new colour" case never terminates,
    // because the rewritten cell still matches the target colour.
    if (oldColor == color) return image;

    int rows = (int)image.size(), cols = (int)image[0].size();
    const int dirs[4][2] = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

    queue<pair<int, int>> q;
    image[sr][sc] = color;   // recolouring IS the visited mark, so no seen[] array
    q.push({sr, sc});

    while (!q.empty()) {
        int r = q.front().first, c = q.front().second;
        q.pop();
        for (auto& d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
            // Only equal-coloured neighbours belong to the region; everything else
            // is a wall for this fill.
            if (image[nr][nc] != oldColor) continue;
            image[nr][nc] = color;
            q.push({nr, nc});
        }
    }
    return image;
}`

const ISLANDS_CPP = `#include <bits/stdc++.h>
using namespace std;

// Sinks one island: every land cell it reaches becomes water, so the outer scan
// can never start a second traversal inside the same component.
void sinkIsland(vector<vector<char>>& grid, int r, int c) {
    if (r < 0 || c < 0 || r >= (int)grid.size() || c >= (int)grid[0].size()) return;
    if (grid[r][c] != '1') return;

    grid[r][c] = '0';   // mark before recursing, otherwise neighbours bounce back into r,c
    sinkIsland(grid, r + 1, c);
    sinkIsland(grid, r - 1, c);
    sinkIsland(grid, r, c + 1);
    sinkIsland(grid, r, c - 1);
}

// Number of 4-connected components of land. The grid is modified in place; pass
// a copy if the caller still needs the original.
int numIslands(vector<vector<char>>& grid) {
    if (grid.empty()) return 0;
    int count = 0;
    for (int r = 0; r < (int)grid.size(); ++r) {
        for (int c = 0; c < (int)grid[0].size(); ++c) {
            // Every surviving '1' is unreachable from all previous starts, so it
            // necessarily opens a brand-new island.
            if (grid[r][c] == '1') {
                ++count;
                sinkIsland(grid, r, c);
            }
        }
    }
    return count;
}`

const ROTTEN_CPP = `#include <bits/stdc++.h>
using namespace std;

// grid: 0 empty, 1 fresh, 2 rotten. Returns minutes until nothing fresh is left,
// or -1 when some fresh orange is unreachable.
int orangesRotting(vector<vector<int>> grid) {
    int rows = (int)grid.size(), cols = (int)grid[0].size();
    queue<pair<int, int>> q;
    int fresh = 0;

    // Seed EVERY initially rotten cell at time 0: rotting happens simultaneously,
    // which is exactly multi-source BFS, not one BFS per source.
    for (int r = 0; r < rows; ++r) {
        for (int c = 0; c < cols; ++c) {
            if (grid[r][c] == 2) q.push({r, c});
            else if (grid[r][c] == 1) ++fresh;
        }
    }

    const int dirs[4][2] = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
    int minutes = 0;
    // Layer-by-layer: one full frontier equals one minute of wall-clock time.
    while (!q.empty() && fresh > 0) {
        int sz = (int)q.size();
        ++minutes;
        for (int i = 0; i < sz; ++i) {
            int r = q.front().first, c = q.front().second;
            q.pop();
            for (auto& d : dirs) {
                int nr = r + d[0], nc = c + d[1];
                if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
                if (grid[nr][nc] != 1) continue;
                grid[nr][nc] = 2;   // mark on enqueue so it is counted once
                --fresh;
                q.push({nr, nc});
            }
        }
    }

    // Leftover fresh oranges sit in a component with no rotten source.
    return fresh == 0 ? minutes : -1;
}`

const WORD_LADDER_CPP = `#include <bits/stdc++.h>
using namespace std;

// Shortest transformation length counting BOTH endpoints; 0 when unreachable.
// Vertices are words, edges join words at Hamming distance 1.
int ladderLength(const string& beginWord, const string& endWord, const vector<string>& wordList) {
    unordered_set<string> dict(wordList.begin(), wordList.end());
    if (dict.find(endWord) == dict.end()) return 0;   // target is not a vertex at all
    dict.erase(beginWord);

    queue<string> q;
    q.push(beginWord);
    int steps = 1;

    while (!q.empty()) {
        // Drain exactly one BFS layer per outer iteration so steps tracks depth.
        int sz = (int)q.size();
        for (int i = 0; i < sz; ++i) {
            string word = q.front();
            q.pop();
            if (word == endWord) return steps;

            // Neighbours are GENERATED (26*L candidates) rather than found by
            // comparing against every dictionary word, which would cost O(N*L)
            // per pop and dominate the whole search.
            for (int p = 0; p < (int)word.size(); ++p) {
                char original = word[p];
                for (char c = 'a'; c <= 'z'; ++c) {
                    if (c == original) continue;
                    word[p] = c;
                    // erase() tests membership and marks visited in one step; that
                    // is what stops one word being enqueued by two frontier words.
                    if (dict.erase(word)) q.push(word);
                }
                word[p] = original;
            }
        }
        ++steps;
    }
    return 0;
}`

const SNAKES_CPP = `#include <bits/stdc++.h>
using namespace std;

// board[0] is the TOP row; labels 1..n*n snake from the bottom-left corner.
int snakesAndLadders(const vector<vector<int>>& board) {
    int n = (int)board.size();
    vector<int> jump(n * n + 1, -1);

    // Flatten the boustrophedon numbering once, so BFS can work purely on labels.
    int label = 1, row = n - 1, col = 0, dir = 1;
    while (label <= n * n) {
        if (board[row][col] != -1) jump[label] = board[row][col];
        ++label;
        col += dir;
        if (col == n || col < 0) {   // row finished: flip direction and move up
            dir = -dir;
            col += dir;
            --row;
        }
    }

    vector<char> seen(n * n + 1, 0);
    queue<pair<int, int>> q;   // {label, throws used}
    q.push({1, 0});
    seen[1] = 1;

    while (!q.empty()) {
        int cur = q.front().first, throws = q.front().second;
        q.pop();
        if (cur == n * n) return throws;   // BFS: first arrival uses the fewest throws

        for (int roll = 1; roll <= 6 && cur + roll <= n * n; ++roll) {
            int next = cur + roll;
            // A snake/ladder is a forced teleport, so the visited flag must belong
            // to the DESTINATION square, not to the square the die landed on.
            if (jump[next] != -1) next = jump[next];
            if (!seen[next]) {
                seen[next] = 1;
                q.push({next, throws + 1});
            }
        }
    }
    return -1;
}`

const BIN_MATRIX_CPP = `#include <bits/stdc++.h>
using namespace std;

// Shortest 8-connected path of open cells (0 = open) from (0,0) to (n-1,n-1),
// measured in CELLS visited. Returns -1 when blocked.
int shortestPathBinaryMatrix(vector<vector<int>> grid) {
    int n = (int)grid.size();
    if (grid[0][0] != 0 || grid[n - 1][n - 1] != 0) return -1;   // endpoints must be open

    const int dirs[8][2] = {{1, 0}, {-1, 0}, {0, 1}, {0, -1},
                            {1, 1}, {1, -1}, {-1, 1}, {-1, -1}};

    queue<array<int, 3>> q;   // {row, col, cells so far}
    q.push({0, 0, 1});
    grid[0][0] = 1;   // reuse the grid as the visited marker: 1 means blocked/seen

    while (!q.empty()) {
        auto cur = q.front();
        q.pop();
        if (cur[0] == n - 1 && cur[1] == n - 1) return cur[2];

        for (auto& d : dirs) {
            int nr = cur[0] + d[0], nc = cur[1] + d[1];
            if (nr < 0 || nc < 0 || nr >= n || nc >= n) continue;
            if (grid[nr][nc] != 0) continue;
            // Mark on ENQUEUE. Marking on dequeue would let the same cell enter
            // the queue from several diagonal neighbours in the same layer.
            grid[nr][nc] = 1;
            q.push({nr, nc, cur[2] + 1});
        }
    }
    return -1;
}`

const PACIFIC_CPP = `#include <bits/stdc++.h>
using namespace std;

// Reverse the flow: start at an ocean border and walk to neighbours that are
// EQUAL OR HIGHER. Those are exactly the cells that can drain into that ocean.
void reachableFromOcean(const vector<vector<int>>& height, queue<pair<int, int>> frontier,
                        vector<vector<char>>& seen) {
    int rows = (int)height.size(), cols = (int)height[0].size();
    const int dirs[4][2] = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

    while (!frontier.empty()) {
        int r = frontier.front().first, c = frontier.front().second;
        frontier.pop();
        // Border cells are seeded in bulk and can repeat (corners), so filter here.
        if (seen[r][c]) continue;
        seen[r][c] = 1;

        for (auto& d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
            if (seen[nr][nc]) continue;
            // Uphill in the reversed search == downhill for the water.
            if (height[nr][nc] < height[r][c]) continue;
            frontier.push({nr, nc});
        }
    }
}

vector<pair<int, int>> pacificAtlantic(const vector<vector<int>>& height) {
    int rows = (int)height.size(), cols = (int)height[0].size();
    vector<vector<char>> pacific(rows, vector<char>(cols, 0));
    vector<vector<char>> atlantic(rows, vector<char>(cols, 0));

    queue<pair<int, int>> qp, qa;
    for (int r = 0; r < rows; ++r) {
        qp.push({r, 0});          // left edge touches the Pacific
        qa.push({r, cols - 1});   // right edge touches the Atlantic
    }
    for (int c = 0; c < cols; ++c) {
        qp.push({0, c});          // top edge
        qa.push({rows - 1, c});   // bottom edge
    }

    // Two independent multi-source searches; intersecting them is what makes the
    // whole thing O(rows*cols) instead of one search per cell.
    reachableFromOcean(height, qp, pacific);
    reachableFromOcean(height, qa, atlantic);

    vector<pair<int, int>> answer;
    for (int r = 0; r < rows; ++r) {
        for (int c = 0; c < cols; ++c) {
            if (pacific[r][c] && atlantic[r][c]) answer.push_back({r, c});
        }
    }
    return answer;
}`

const KNIGHT_CPP = `#include <bits/stdc++.h>
using namespace std;

// Minimum knight moves on an N x N board with 1-based squares, or -1.
int minKnightSteps(int N, pair<int, int> knight, pair<int, int> target) {
    const int moves[8][2] = {{2, 1}, {2, -1}, {-2, 1}, {-2, -1},
                             {1, 2}, {1, -2}, {-1, 2}, {-1, -2}};

    vector<vector<char>> seen(N + 1, vector<char>(N + 1, 0));
    queue<array<int, 3>> q;   // {x, y, steps}
    q.push({knight.first, knight.second, 0});
    seen[knight.first][knight.second] = 1;

    while (!q.empty()) {
        auto cur = q.front();
        q.pop();
        // Every jump costs exactly 1, so the first dequeue of the target is optimal.
        if (cur[0] == target.first && cur[1] == target.second) return cur[2];

        for (auto& m : moves) {
            int nx = cur[0] + m[0], ny = cur[1] + m[1];
            if (nx < 1 || ny < 1 || nx > N || ny > N) continue;
            if (seen[nx][ny]) continue;
            // Mark on enqueue: up to 8 squares reach the same cell in one layer.
            seen[nx][ny] = 1;
            q.push({nx, ny, cur[2] + 1});
        }
    }
    return -1;   // knight and target lie in different components (tiny boards)
}`

const WATER_CPP = `#include <bits/stdc++.h>
using namespace std;

// BFS over the finite state space of jug contents. A state (a, b) is a vertex;
// the six legal operations are its outgoing edges.
bool canMeasureWater(int x, int y, int z) {
    if (z > x + y) return false;   // more than both jugs can ever hold together

    // Encode (a, b) into one integer key so the visited set is a flat hash set.
    auto encode = [&](int a, int b) { return a * (y + 1) + b; };

    vector<char> seen((size_t)(x + 1) * (y + 1), 0);
    queue<pair<int, int>> q;
    q.push({0, 0});
    seen[encode(0, 0)] = 1;

    while (!q.empty()) {
        int a = q.front().first, b = q.front().second;
        q.pop();
        // z may sit in either jug or be their combined content.
        if (a == z || b == z || a + b == z) return true;

        int pourAtoB = min(a, y - b);
        int pourBtoA = min(b, x - a);
        pair<int, int> next[6] = {
            {x, b},                              // fill jug A
            {a, y},                              // fill jug B
            {0, b},                              // empty jug A
            {a, 0},                              // empty jug B
            {a - pourAtoB, b + pourAtoB},        // pour A into B until one is done
            {a + pourBtoA, b - pourBtoA}         // pour B into A until one is done
        };

        for (auto& s : next) {
            int key = encode(s.first, s.second);
            // The state space is only (x+1)*(y+1) large, so the visited check turns
            // an infinite operation sequence into a finite graph search.
            if (!seen[key]) {
                seen[key] = 1;
                q.push(s);
            }
        }
    }
    return false;
}

// Number-theory shortcut: reachable amounts are exactly the multiples of gcd.
bool canMeasureWaterBezout(int x, int y, int z) {
    if (z > x + y) return false;
    return z % __gcd(x, y) == 0;
}`

const BOGGLE_CPP = `#include <bits/stdc++.h>
using namespace std;

// Trie stored as a flat vector: children indices instead of pointers keeps the
// hot DFS loop cache friendly.
struct Trie {
    struct Node {
        int child[26];
        int wordIndex = -1;
        Node() { fill(begin(child), end(child), -1); }
    };
    vector<Node> nodes{1};

    void insert(const string& word, int index) {
        int cur = 0;
        for (char ch : word) {
            int c = ch - 'a';
            if (nodes[cur].child[c] == -1) {
                nodes[cur].child[c] = (int)nodes.size();
                nodes.emplace_back();
            }
            cur = nodes[cur].child[c];
        }
        nodes[cur].wordIndex = index;
    }
};

void boggleDfs(vector<vector<char>>& board, int r, int c, int node,
               Trie& trie, const vector<string>& words, vector<string>& found) {
    if (r < 0 || c < 0 || r >= (int)board.size() || c >= (int)board[0].size()) return;

    char ch = board[r][c];
    if (ch == '#') return;                          // '#' marks a cell already on this path
    int next = trie.nodes[node].child[ch - 'a'];
    // Prefix pruning: the moment the path stops spelling a dictionary prefix we
    // abandon it, which is what makes the exponential search tractable.
    if (next == -1) return;

    if (trie.nodes[next].wordIndex != -1) {
        found.push_back(words[trie.nodes[next].wordIndex]);
        trie.nodes[next].wordIndex = -1;            // report each word once
    }

    board[r][c] = '#';                              // occupy the cell for this path only
    // 4-directional adjacency. Classic Boggle uses all 8 neighbours; add the four
    // diagonals here and nothing else about the search changes.
    boggleDfs(board, r + 1, c, next, trie, words, found);
    boggleDfs(board, r - 1, c, next, trie, words, found);
    boggleDfs(board, r, c + 1, next, trie, words, found);
    boggleDfs(board, r, c - 1, next, trie, words, found);
    board[r][c] = ch;                                // restore on the way out (backtracking)
}

vector<string> findBoggleWords(vector<vector<char>> board, const vector<string>& words) {
    Trie trie;
    for (int i = 0; i < (int)words.size(); ++i) trie.insert(words[i], i);

    vector<string> found;
    // Any cell can start a word, so every cell seeds its own backtracking search.
    for (int r = 0; r < (int)board.size(); ++r) {
        for (int c = 0; c < (int)board[0].size(); ++c) {
            boggleDfs(board, r, c, 0, trie, words, found);
        }
    }
    return found;
}`

/* ------------------------------------------------------------------ */
/* Cycles                                                             */
/* ------------------------------------------------------------------ */

const CYCLE_UNDIRECTED_DFS_CPP = `#include <bits/stdc++.h>
using namespace std;

bool undirectedCycleDfs(int u, int parent, const vector<vector<int>>& adj, vector<char>& seen) {
    seen[u] = 1;   // mark before recursing, otherwise a cycle re-enters u forever
    for (int v : adj[u]) {
        if (!seen[v]) {
            if (undirectedCycleDfs(v, u, adj, seen)) return true;
        } else if (v != parent) {
            // Every undirected edge is stored twice, so the edge we ARRIVED on
            // always points back at a visited vertex. Excluding the parent removes
            // that false positive; any other seen neighbour is a genuine back edge.
            return true;
        }
    }
    return false;
}

bool hasCycleUndirected(const vector<vector<int>>& adj) {
    vector<char> seen(adj.size(), 0);
    // One DFS per component: a cycle can hide anywhere, not just near vertex 0.
    for (int u = 0; u < (int)adj.size(); ++u) {
        if (!seen[u] && undirectedCycleDfs(u, -1, adj, seen)) return true;
    }
    return false;
}

// Parallel edges break the parent-vertex trick (u-v twice IS a cycle), so track
// the incoming EDGE id instead when the input may be a multigraph.
bool hasCycleUndirectedMultigraph(int n, const vector<vector<pair<int, int>>>& adj) {
    vector<char> seen(n, 0);
    for (int s = 0; s < n; ++s) {
        if (seen[s]) continue;
        vector<pair<int, int>> st{{s, -1}};   // {vertex, edge id we entered on}
        seen[s] = 1;
        while (!st.empty()) {
            auto [u, inEdge] = st.back();
            st.pop_back();
            for (auto& [v, id] : adj[u]) {
                if (id == inEdge) continue;
                if (seen[v]) return true;
                seen[v] = 1;
                st.push_back({v, id});
            }
        }
    }
    return false;
}`

const CYCLE_UNDIRECTED_BFS_CPP = `#include <bits/stdc++.h>
using namespace std;

// BFS cycle detection. The queue state carries the parent, because that is the
// single already-seen adjacency the BFS tree can legitimately explain.
bool hasCycleUndirectedBfs(const vector<vector<int>>& adj) {
    int n = (int)adj.size();
    vector<char> seen(n, 0);

    for (int start = 0; start < n; ++start) {
        if (seen[start]) continue;   // restart per component

        queue<pair<int, int>> q;   // {vertex, parent}
        q.push({start, -1});
        seen[start] = 1;

        while (!q.empty()) {
            int u = q.front().first, parent = q.front().second;
            q.pop();
            for (int v : adj[u]) {
                if (!seen[v]) {
                    // Mark on enqueue; marking on dequeue would let two frontier
                    // vertices both push v and then report a phantom cycle.
                    seen[v] = 1;
                    q.push({v, u});
                } else if (v != parent) {
                    // v was reached by an earlier BFS layer through a different
                    // route, so that route plus this edge closes a cycle.
                    return true;
                }
            }
        }
    }
    return false;
}`

const SHORTEST_CYCLE_CPP = `#include <bits/stdc++.h>
using namespace std;

// Girth of an undirected unweighted graph, or -1 when it is a forest.
// One BFS per source: O(V*(V+E)) total.
int shortestCycleLength(const vector<vector<int>>& adj) {
    int n = (int)adj.size();
    int best = INT_MAX;

    for (int source = 0; source < n; ++source) {
        vector<int> dist(n, -1), parent(n, -1);
        queue<int> q;
        dist[source] = 0;
        q.push(source);

        while (!q.empty()) {
            int u = q.front();
            q.pop();
            for (int v : adj[u]) {
                if (dist[v] == -1) {
                    dist[v] = dist[u] + 1;
                    parent[v] = u;   // BFS-tree edge
                    q.push(v);
                } else if (parent[u] != v) {
                    // A non-tree edge u-v joins two discovered vertices. Their two
                    // BFS-tree paths back to the source plus this edge form a closed
                    // walk of length dist[u] + dist[v] + 1; the minimum over all
                    // sources and edges is the true shortest cycle.
                    best = min(best, dist[u] + dist[v] + 1);
                }
            }
        }
    }
    return best == INT_MAX ? -1 : best;
}`

const CYCLES_N_CPP = `#include <bits/stdc++.h>
using namespace std;

int countCyclesFrom(int start, int u, int remaining,
                    const vector<vector<int>>& adj, vector<char>& onPath) {
    if (remaining == 0) {
        // The path already has n vertices; it is a cycle iff it closes back to start.
        return find(adj[u].begin(), adj[u].end(), start) != adj[u].end() ? 1 : 0;
    }

    onPath[u] = 1;
    int count = 0;
    for (int v : adj[u]) {
        // v > start keeps start as the SMALLEST vertex of the cycle, so each cycle
        // is enumerated from one fixed starting point instead of n of them.
        if (!onPath[v] && v > start) count += countCyclesFrom(start, v, remaining - 1, adj, onPath);
    }
    onPath[u] = 0;   // backtrack: u may belong to a different cycle later
    return count;
}

// Number of simple cycles with exactly n vertices in an undirected graph.
int countCyclesOfLength(const vector<vector<int>>& adj, int n) {
    int V = (int)adj.size();
    if (n < 3 || n > V) return 0;

    vector<char> onPath(V, 0);
    int count = 0;
    for (int start = 0; start + n <= V; ++start) {
        count += countCyclesFrom(start, start, n - 1, adj, onPath);
    }
    // Each cycle is still walked in both directions from its minimum vertex.
    return count / 2;
}`

const ALL_CYCLES_CPP = `#include <bits/stdc++.h>
using namespace std;

// Canonical form of a cycle. The SAME cycle can be written n different ways by
// rotation and twice more by direction, so both must be normalised away:
// rotate the minimum vertex to the front, then keep the lexicographically
// smaller of the two traversal directions. Reversing the vector alone is not
// enough, because that also rotates the starting point.
vector<int> normalizeCycle(const vector<int>& cycle) {
    int n = (int)cycle.size();
    int at = (int)(min_element(cycle.begin(), cycle.end()) - cycle.begin());

    vector<int> forward, backward;
    forward.reserve(n);
    backward.reserve(n);
    for (int i = 0; i < n; ++i) {
        forward.push_back(cycle[(at + i) % n]);
        backward.push_back(cycle[(at - i + n) % n]);
    }
    return forward < backward ? forward : backward;
}

void enumerateCycles(int start, int u, const vector<vector<int>>& adj,
                     vector<char>& onPath, vector<int>& path, set<vector<int>>& cycles) {
    onPath[u] = 1;
    path.push_back(u);

    for (int v : adj[u]) {
        // Length >= 3 rejects the trivial "walk back along the parent edge".
        if (v == start && (int)path.size() >= 3) {
            cycles.insert(normalizeCycle(path));
        } else if (!onPath[v] && v >= start) {
            // v >= start pins start as the minimum vertex of every cycle found in
            // this branch, which kills all n rotations of the same cycle.
            enumerateCycles(start, v, adj, onPath, path, cycles);
        }
    }

    path.pop_back();
    onPath[u] = 0;   // restore state so other branches can reuse u
}

// All simple cycles, deduplicated across rotations and directions.
set<vector<int>> allSimpleCycles(const vector<vector<int>>& adj) {
    set<vector<int>> cycles;
    for (int start = 0; start < (int)adj.size(); ++start) {
        vector<char> onPath(adj.size(), 0);
        vector<int> path;
        enumerateCycles(start, start, adj, onPath, path, cycles);
    }
    return cycles;
}`

const CYCLE_DETECTION_CPP = `#include <bits/stdc++.h>
using namespace std;

// ---- Method 1: three-state DFS. Works on directed graphs of any shape. ----
enum State { NEW = 0, ACTIVE = 1, DONE = 2 };

bool directedCycleDfs(int u, const vector<vector<int>>& adj, vector<int>& state) {
    state[u] = ACTIVE;   // u joins the current recursion path
    for (int v : adj[u]) {
        // ACTIVE means v is an ancestor on the path we are standing on, so the
        // edge u->v closes a directed cycle.
        if (state[v] == ACTIVE) return true;
        // DONE means v is finished and cannot reach u, so a cross/forward edge to
        // it is harmless. This is precisely why one visited flag is not enough.
        if (state[v] == NEW && directedCycleDfs(v, adj, state)) return true;
    }
    state[u] = DONE;     // u leaves the path
    return false;
}

bool hasCycleDirected(const vector<vector<int>>& adj) {
    vector<int> state(adj.size(), NEW);
    for (int u = 0; u < (int)adj.size(); ++u) {
        if (state[u] == NEW && directedCycleDfs(u, adj, state)) return true;
    }
    return false;
}

// ---- Method 2: Kahn's processed count. Also yields a topological order. ----
bool hasCycleDirectedKahn(const vector<vector<int>>& adj) {
    int n = (int)adj.size();
    vector<int> indeg(n, 0);
    for (int u = 0; u < n; ++u) {
        for (int v : adj[u]) ++indeg[v];
    }

    queue<int> q;
    for (int u = 0; u < n; ++u) {
        if (indeg[u] == 0) q.push(u);
    }

    int removed = 0;
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        ++removed;
        for (int v : adj[u]) {
            if (--indeg[v] == 0) q.push(v);
        }
    }
    // Every DAG has a zero-indegree vertex, so a DAG drains completely. Vertices
    // left behind are exactly those trapped on or below a cycle.
    return removed != n;
}

// Undirected graphs need the parent check instead of colours: the reverse copy
// of the edge we arrived on is not a cycle.
bool undirectedCycleDfs(int u, int parent, const vector<vector<int>>& adj, vector<char>& seen) {
    seen[u] = 1;
    for (int v : adj[u]) {
        if (!seen[v]) {
            if (undirectedCycleDfs(v, u, adj, seen)) return true;
        } else if (v != parent) {
            return true;
        }
    }
    return false;
}

bool hasCycleUndirected(const vector<vector<int>>& adj) {
    vector<char> seen(adj.size(), 0);
    for (int u = 0; u < (int)adj.size(); ++u) {
        if (!seen[u] && undirectedCycleDfs(u, -1, adj, seen)) return true;
    }
    return false;
}`

const DIRECTED_KAHN_CYCLE_CPP = `#include <bits/stdc++.h>
using namespace std;

// Detect a directed cycle by ATTEMPTING Kahn's topological elimination. No
// recursion, so it is safe on graphs deep enough to blow the call stack.
bool hasCycleKahn(const vector<vector<int>>& adj) {
    int n = (int)adj.size();
    vector<int> indeg(n, 0);
    for (int u = 0; u < n; ++u) {
        for (int v : adj[u]) ++indeg[v];
    }

    queue<int> q;
    // Indegree 0 == "no unmet prerequisite" == removable right now.
    for (int u = 0; u < n; ++u) {
        if (indeg[u] == 0) q.push(u);
    }

    int removed = 0;
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        ++removed;
        for (int v : adj[u]) {
            // Enqueue v only when its LAST prerequisite disappears; that keeps each
            // vertex enqueued exactly once and the whole scan O(V+E).
            if (--indeg[v] == 0) q.push(v);
        }
    }

    // Every non-empty DAG has at least one zero-indegree vertex, so a DAG drains
    // to zero. Anything left over still has an unremoved predecessor, which can
    // only happen inside (or downstream of) a cycle.
    return removed != n;
}

// Same sweep, but returns the order when the graph is acyclic (empty otherwise).
vector<int> topologicalOrderOrEmpty(const vector<vector<int>>& adj) {
    int n = (int)adj.size();
    vector<int> indeg(n, 0), order;
    order.reserve(n);
    for (int u = 0; u < n; ++u) {
        for (int v : adj[u]) ++indeg[v];
    }
    queue<int> q;
    for (int u = 0; u < n; ++u) {
        if (indeg[u] == 0) q.push(u);
    }
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        order.push_back(u);
        for (int v : adj[u]) {
            if (--indeg[v] == 0) q.push(v);
        }
    }
    if ((int)order.size() != n) return {};
    return order;
}`

const COLORS_CPP = `#include <bits/stdc++.h>
using namespace std;

// WHITE = untouched, GRAY = on the active recursion path, BLACK = finished.
enum Color { WHITE = 0, GRAY = 1, BLACK = 2 };

bool colorDfs(int u, const vector<vector<int>>& adj, vector<int>& color) {
    color[u] = GRAY;   // u enters the active path
    for (int v : adj[u]) {
        // GRAY neighbour = ancestor on the path we are standing on = back edge,
        // and a back edge in a digraph is exactly a directed cycle.
        if (color[v] == GRAY) return true;
        if (color[v] == WHITE && colorDfs(v, adj, color)) return true;
        // BLACK neighbour: already finished, so it cannot reach u. Forward and
        // cross edges are legal in a DAG, which is why a single visited flag
        // would report false cycles here.
    }
    color[u] = BLACK;  // u leaves the active path
    return false;
}

bool hasDirectedCycle(const vector<vector<int>>& adj) {
    vector<int> color(adj.size(), WHITE);
    for (int u = 0; u < (int)adj.size(); ++u) {
        if (color[u] == WHITE && colorDfs(u, adj, color)) return true;
    }
    return false;
}

// Same colouring, but reconstructs one witness cycle from the parent chain.
vector<int> findDirectedCycle(const vector<vector<int>>& adj) {
    int n = (int)adj.size();
    vector<int> color(n, WHITE), parent(n, -1);
    int cycleStart = -1, cycleEnd = -1;

    function<bool(int)> dfs = [&](int u) {
        color[u] = GRAY;
        for (int v : adj[u]) {
            if (color[v] == WHITE) {
                parent[v] = u;
                if (dfs(v)) return true;
            } else if (color[v] == GRAY) {
                // Remember both endpoints of the back edge; the cycle is the parent
                // chain from cycleEnd up to cycleStart, plus this edge.
                cycleStart = v;
                cycleEnd = u;
                return true;
            }
        }
        color[u] = BLACK;
        return false;
    };

    for (int u = 0; u < n; ++u) {
        if (color[u] == WHITE && dfs(u)) break;
    }
    if (cycleStart == -1) return {};

    vector<int> cycle;
    for (int v = cycleEnd; v != cycleStart; v = parent[v]) cycle.push_back(v);
    cycle.push_back(cycleStart);
    reverse(cycle.begin(), cycle.end());
    return cycle;
}`

const NEG_CYCLE_CPP = `#include <bits/stdc++.h>
using namespace std;

struct Edge {
    int u, v, w;
};

// Negative cycle ANYWHERE in the digraph (not just reachable from one source).
bool hasNegativeCycle(int V, const vector<Edge>& edges) {
    // Start every vertex at 0 instead of INF. That is equivalent to adding a
    // virtual super-source with zero-cost edges to all vertices, so a negative
    // cycle in any component becomes reachable and therefore detectable.
    vector<long long> dist(V, 0);

    for (int round = 0; round < V - 1; ++round) {
        bool changed = false;
        for (const Edge& e : edges) {
            if (dist[e.u] + e.w < dist[e.v]) {
                dist[e.v] = dist[e.u] + e.w;
                changed = true;
            }
        }
        if (!changed) return false;   // fixed point before round V-1 => no negative cycle
    }

    // After V-1 rounds every SIMPLE path is optimal, so a further improvement can
    // only come from repeating a cycle whose total weight is negative.
    for (const Edge& e : edges) {
        if (dist[e.u] + e.w < dist[e.v]) return true;
    }
    return false;
}

// Extract one witness cycle: walk the predecessor chain V times to land inside it.
vector<int> findNegativeCycle(int V, const vector<Edge>& edges) {
    vector<long long> dist(V, 0);
    vector<int> parent(V, -1);
    int landed = -1;

    for (int round = 0; round < V; ++round) {
        landed = -1;
        for (const Edge& e : edges) {
            if (dist[e.u] + e.w < dist[e.v]) {
                dist[e.v] = dist[e.u] + e.w;
                parent[e.v] = e.u;
                landed = e.v;   // improved on round V => sits on/behind a negative cycle
            }
        }
    }
    if (landed == -1) return {};

    // V predecessor hops guarantee we are ON the cycle, not merely leading to it.
    for (int i = 0; i < V; ++i) landed = parent[landed];

    vector<int> cycle;
    for (int v = landed;; v = parent[v]) {
        cycle.push_back(v);
        if (v == landed && cycle.size() > 1) break;
    }
    reverse(cycle.begin(), cycle.end());
    return cycle;
}`

/* ------------------------------------------------------------------ */
/* Topological order and DAG DP                                        */
/* ------------------------------------------------------------------ */

const KAHN_CPP = `#include <bits/stdc++.h>
using namespace std;

// Topological order of a DAG, or an empty vector when a cycle exists.
vector<int> topologicalSortKahn(const vector<vector<int>>& adj) {
    int n = (int)adj.size();
    vector<int> indeg(n, 0);
    for (int u = 0; u < n; ++u) {
        for (int v : adj[u]) ++indeg[v];
    }

    queue<int> q;
    // Indegree 0 means "no unmet prerequisite", so these are safe to emit now.
    for (int u = 0; u < n; ++u) {
        if (indeg[u] == 0) q.push(u);
    }

    vector<int> order;
    order.reserve(n);
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        order.push_back(u);
        for (int v : adj[u]) {
            // Placing u satisfies one prerequisite of v. Enqueue v only when the
            // LAST one drops away, so every vertex enters the queue exactly once.
            if (--indeg[v] == 0) q.push(v);
        }
    }

    // Emitted fewer than n vertices => some indegree never reached 0 => cycle.
    if ((int)order.size() != n) return {};
    return order;
}

// Same algorithm with a min-heap when the problem wants the lexicographically
// smallest valid order (the heap only changes tie-breaking, not correctness).
vector<int> topologicalSortSmallest(const vector<vector<int>>& adj) {
    int n = (int)adj.size();
    vector<int> indeg(n, 0);
    for (int u = 0; u < n; ++u) {
        for (int v : adj[u]) ++indeg[v];
    }
    priority_queue<int, vector<int>, greater<int>> pq;
    for (int u = 0; u < n; ++u) {
        if (indeg[u] == 0) pq.push(u);
    }
    vector<int> order;
    while (!pq.empty()) {
        int u = pq.top();
        pq.pop();
        order.push_back(u);
        for (int v : adj[u]) {
            if (--indeg[v] == 0) pq.push(v);
        }
    }
    if ((int)order.size() != n) return {};
    return order;
}`

const DAG_DP_CPP = `#include <bits/stdc++.h>
using namespace std;

const long long NEG_INF = LLONG_MIN / 4;   // /4 leaves headroom so NEG_INF + w cannot underflow

// adj[u] holds {v, w}. Returns dp[v] = longest src->v distance, NEG_INF if
// unreachable. Any associative combine (min, max, count) works the same way.
vector<long long> dagLongestFrom(int src, const vector<vector<pair<int, int>>>& adj) {
    int n = (int)adj.size();

    // Step 1: topological order (Kahn).
    vector<int> indeg(n, 0);
    for (int u = 0; u < n; ++u) {
        for (auto& e : adj[u]) ++indeg[e.first];
    }
    queue<int> q;
    for (int u = 0; u < n; ++u) {
        if (indeg[u] == 0) q.push(u);
    }
    vector<int> order;
    order.reserve(n);
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        order.push_back(u);
        for (auto& e : adj[u]) {
            if (--indeg[e.first] == 0) q.push(e.first);
        }
    }

    // Step 2: one relaxation sweep in that order.
    vector<long long> dp(n, NEG_INF);
    dp[src] = 0;
    for (int u : order) {
        // In topological order every predecessor of u has already been processed,
        // so dp[u] is FINAL here. That is why a single pass suffices and why the
        // same code would be wrong on a graph with cycles.
        if (dp[u] == NEG_INF) continue;   // never propagate out of an unreachable vertex
        for (auto& [v, w] : adj[u]) dp[v] = max(dp[v], dp[u] + w);
    }
    return dp;
}

// Counting variant: number of distinct src->v paths in the same single sweep.
vector<long long> dagCountPaths(int src, const vector<vector<int>>& adj) {
    int n = (int)adj.size();
    vector<int> indeg(n, 0);
    for (int u = 0; u < n; ++u) {
        for (int v : adj[u]) ++indeg[v];
    }
    queue<int> q;
    for (int u = 0; u < n; ++u) {
        if (indeg[u] == 0) q.push(u);
    }
    vector<long long> ways(n, 0);
    ways[src] = 1;
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        for (int v : adj[u]) {
            ways[v] += ways[u];   // safe: ways[u] is complete before u is dequeued
            if (--indeg[v] == 0) q.push(v);
        }
    }
    return ways;
}`

const TOPO_DEP_CPP = `#include <bits/stdc++.h>
using namespace std;

enum TopoState { UNVISITED = 0, ON_PATH = 1, FINISHED = 2 };

// Pushes u onto the stack at its DEPARTURE (finish) time. Returns false the
// moment a back edge proves the graph is not a DAG.
bool departureDfs(int u, const vector<vector<int>>& adj, vector<int>& state, vector<int>& stack) {
    state[u] = ON_PATH;
    for (int v : adj[u]) {
        if (state[v] == ON_PATH) return false;   // back edge into the active path => cycle
        if (state[v] == UNVISITED && !departureDfs(v, adj, state, stack)) return false;
    }
    state[u] = FINISHED;
    // u departs only after every descendant has departed, so u lands ABOVE all of
    // them on the stack. Popping the stack therefore yields decreasing finish time.
    stack.push_back(u);
    return true;
}

// Topological order by decreasing DFS departure time; empty when cyclic.
vector<int> topologicalOrderByDepartureTime(const vector<vector<int>>& adj) {
    int n = (int)adj.size();
    vector<int> state(n, UNVISITED), stack;
    stack.reserve(n);

    for (int u = 0; u < n; ++u) {
        if (state[u] == UNVISITED && !departureDfs(u, adj, state, stack)) return {};
    }

    reverse(stack.begin(), stack.end());   // decreasing departure time == topological order
    return stack;
}

// The raw departure timestamps, useful for classifying edges (a back edge is
// exactly an edge u->v with departure[v] > departure[u]).
vector<int> departureTimes(const vector<vector<int>>& adj) {
    int n = (int)adj.size();
    vector<int> departure(n, -1), state(n, UNVISITED);
    int timer = 0;

    function<void(int)> dfs = [&](int u) {
        state[u] = ON_PATH;
        for (int v : adj[u]) {
            if (state[v] == UNVISITED) dfs(v);
        }
        state[u] = FINISHED;
        departure[u] = timer++;
    };

    for (int u = 0; u < n; ++u) {
        if (state[u] == UNVISITED) dfs(u);
    }
    return departure;
}`

const ALL_TOPO_CPP = `#include <bits/stdc++.h>
using namespace std;

void allTopoBacktrack(const vector<vector<int>>& adj, vector<int>& indeg, vector<char>& used,
                      vector<int>& path, vector<vector<int>>& out) {
    if (path.size() == adj.size()) {
        out.push_back(path);
        return;
    }

    for (int u = 0; u < (int)adj.size(); ++u) {
        // Only an unused, zero-indegree vertex may be appended: every one of its
        // prerequisites is already somewhere earlier in path[].
        if (used[u] || indeg[u] != 0) continue;

        used[u] = 1;
        path.push_back(u);
        for (int v : adj[u]) --indeg[v];   // pretend u is removed from the graph

        allTopoBacktrack(adj, indeg, used, path, out);

        // Undo in exactly the reverse order; a missed restore silently prunes
        // valid orderings from every later branch.
        for (int v : adj[u]) ++indeg[v];
        path.pop_back();
        used[u] = 0;
    }
}

// Every valid topological ordering of a DAG. Output size can be factorial, so
// this is for small V (or for counting) only.
vector<vector<int>> allTopologicalSorts(const vector<vector<int>>& adj) {
    int n = (int)adj.size();
    vector<int> indeg(n, 0);
    for (int u = 0; u < n; ++u) {
        for (int v : adj[u]) ++indeg[v];
    }

    vector<char> used(n, 0);
    vector<int> path;
    vector<vector<int>> out;
    allTopoBacktrack(adj, indeg, used, path, out);
    return out;
}`

const MAX_EDGES_DAG_CPP = `#include <bits/stdc++.h>
using namespace std;

// Fix any total order of the V labelled vertices and keep only forward edges.
// Every path then strictly increases in that order, so no cycle can exist, and
// all V*(V-1)/2 forward pairs are simultaneously usable.
long long maxEdgesKeepingDag(int V) {
    return 1LL * V * (V - 1) / 2;
}

// Witness: the complete "tournament" DAG achieving that bound.
vector<pair<int, int>> buildMaximalDag(int V) {
    vector<pair<int, int>> edges;
    edges.reserve((size_t)maxEdgesKeepingDag(V));
    for (int i = 0; i < V; ++i) {
        for (int j = i + 1; j < V; ++j) edges.push_back({i, j});   // only i -> j with i < j
    }
    return edges;
}

// Related question: how many edges must be REMOVED from a given digraph to make
// it acyclic under the best relabelling? Adding any further edge to the maximal
// DAG above creates a backward pair, hence a cycle.
long long edgesToRemoveForDag(int V, long long currentEdges) {
    return max(0LL, currentEdges - maxEdgesKeepingDag(V));
}`

const LONGEST_DAG_CPP = `#include <bits/stdc++.h>
using namespace std;

// adj[u] holds {v, w}; weights may be negative because a DAG has no cycles.
// Returns the heaviest path weight anywhere in the DAG.
long long longestPathInDag(const vector<vector<pair<int, int>>>& adj) {
    int n = (int)adj.size();
    vector<int> indeg(n, 0);
    for (int u = 0; u < n; ++u) {
        for (auto& e : adj[u]) ++indeg[e.first];
    }

    queue<int> q;
    for (int u = 0; u < n; ++u) {
        if (indeg[u] == 0) q.push(u);
    }

    // dist starts at 0 everywhere: every vertex is allowed to BEGIN a path, which
    // is what turns "longest from a source" into "longest anywhere".
    vector<long long> dist(n, 0);
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        for (auto& [v, w] : adj[u]) {
            // u is dequeued only after all its predecessors, so dist[u] is final
            // and this single relaxation of edge u->v is enough.
            dist[v] = max(dist[v], dist[u] + w);
            if (--indeg[v] == 0) q.push(v);
        }
    }

    return *max_element(dist.begin(), dist.end());
}

// The same DP also reconstructs one heaviest path via parent pointers.
vector<int> longestPathVertices(const vector<vector<pair<int, int>>>& adj) {
    int n = (int)adj.size();
    vector<int> indeg(n, 0), parent(n, -1);
    for (int u = 0; u < n; ++u) {
        for (auto& e : adj[u]) ++indeg[e.first];
    }
    queue<int> q;
    for (int u = 0; u < n; ++u) {
        if (indeg[u] == 0) q.push(u);
    }
    vector<long long> dist(n, 0);
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        for (auto& [v, w] : adj[u]) {
            if (dist[u] + w > dist[v]) {
                dist[v] = dist[u] + w;
                parent[v] = u;   // record only on a strict improvement
            }
            if (--indeg[v] == 0) q.push(v);
        }
    }
    int best = (int)(max_element(dist.begin(), dist.end()) - dist.begin());
    vector<int> path;
    for (int v = best; v != -1; v = parent[v]) path.push_back(v);
    reverse(path.begin(), path.end());
    return path;
}`

const ITINERARY_CPP = `#include <bits/stdc++.h>
using namespace std;

// Lexicographically smallest itinerary using every ticket exactly once. This is
// an Euler path in the digraph of airports, solved with Hierholzer.
vector<string> findItinerary(const vector<pair<string, string>>& tickets) {
    // Min-heap per airport: always leaving on the smallest unused ticket is what
    // makes the resulting Euler path lexicographically smallest.
    unordered_map<string, priority_queue<string, vector<string>, greater<string>>> out;
    for (const auto& t : tickets) out[t.first].push(t.second);

    vector<string> route;
    vector<string> stack{"JFK"};   // the problem fixes JFK as the start

    while (!stack.empty()) {
        string u = stack.back();
        auto it = out.find(u);
        if (it != out.end() && !it->second.empty()) {
            // Consume the smallest unused ticket out of u and walk it.
            string v = it->second.top();
            it->second.pop();
            stack.push_back(v);
        } else {
            // Stuck at u: every ticket out of u is spent, so u's place in the final
            // itinerary is fixed. Recording it here builds the route back-to-front,
            // which automatically splices dead-end detours into the right slot.
            route.push_back(u);
            stack.pop_back();
        }
    }

    reverse(route.begin(), route.end());
    return route;
}`

const COURSE_CPP = `#include <bits/stdc++.h>
using namespace std;

// prerequisites[i] = {course, needs}. True iff all n courses can be finished,
// i.e. the prerequisite digraph is a DAG.
bool canFinishCourses(int n, const vector<pair<int, int>>& prerequisites) {
    vector<vector<int>> adj(n);
    vector<int> indeg(n, 0);
    for (const auto& p : prerequisites) {
        // Edge direction matters: needs -> course, because the prerequisite must
        // be completed FIRST. Reversing it silently solves a different problem.
        adj[p.second].push_back(p.first);
        ++indeg[p.first];
    }

    queue<int> q;
    for (int c = 0; c < n; ++c) {
        if (indeg[c] == 0) q.push(c);   // no prerequisites: takeable immediately
    }

    int taken = 0;
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        ++taken;
        for (int v : adj[u]) {
            if (--indeg[v] == 0) q.push(v);   // last prerequisite of v just cleared
        }
    }

    // taken < n means some courses never became available, which can only happen
    // when they sit on (or behind) a prerequisite cycle.
    return taken == n;
}

// Course Schedule II: the actual study plan, or empty when impossible.
vector<int> findCourseOrder(int n, const vector<pair<int, int>>& prerequisites) {
    vector<vector<int>> adj(n);
    vector<int> indeg(n, 0);
    for (const auto& p : prerequisites) {
        adj[p.second].push_back(p.first);
        ++indeg[p.first];
    }
    queue<int> q;
    for (int c = 0; c < n; ++c) {
        if (indeg[c] == 0) q.push(c);
    }
    vector<int> order;
    order.reserve(n);
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        order.push_back(u);
        for (int v : adj[u]) {
            if (--indeg[v] == 0) q.push(v);
        }
    }
    if ((int)order.size() != n) return {};
    return order;
}`

/* ------------------------------------------------------------------ */
/* Bipartite / colouring by parity                                     */
/* ------------------------------------------------------------------ */

const BIPARTITE_BFS_CPP = `#include <bits/stdc++.h>
using namespace std;

// Two-colour every component with BFS. False iff some component has an odd cycle.
bool isBipartiteBfs(const vector<vector<int>>& adj) {
    int n = (int)adj.size();
    vector<int> color(n, -1);   // -1 = uncoloured, which doubles as "unvisited"

    for (int start = 0; start < n; ++start) {
        // Components are independent, so the first vertex of each may be given
        // colour 0 for free without losing any solution.
        if (color[start] != -1) continue;
        color[start] = 0;

        queue<int> q;
        q.push(start);
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            for (int v : adj[u]) {
                if (color[v] == -1) {
                    // XOR flips 0<->1: BFS propagates alternating parity by layer.
                    color[v] = color[u] ^ 1;
                    q.push(v);
                } else if (color[v] == color[u]) {
                    // An edge inside one colour class closes an odd-length cycle,
                    // and an odd cycle can never be 2-coloured.
                    return false;
                }
            }
        }
    }
    return true;
}

// Same sweep, but hands back the actual bipartition (empty on failure).
pair<vector<int>, vector<int>> bipartition(const vector<vector<int>>& adj) {
    int n = (int)adj.size();
    vector<int> color(n, -1);
    for (int start = 0; start < n; ++start) {
        if (color[start] != -1) continue;
        color[start] = 0;
        queue<int> q;
        q.push(start);
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            for (int v : adj[u]) {
                if (color[v] == -1) {
                    color[v] = color[u] ^ 1;
                    q.push(v);
                } else if (color[v] == color[u]) {
                    return {{}, {}};
                }
            }
        }
    }
    pair<vector<int>, vector<int>> sides;
    for (int u = 0; u < n; ++u) {
        (color[u] == 0 ? sides.first : sides.second).push_back(u);
    }
    return sides;
}`

const BIPARTITE_DFS_CPP = `#include <bits/stdc++.h>
using namespace std;

// Carries the REQUIRED colour down each path instead of deriving it on arrival.
bool colorDfs(int u, int value, const vector<vector<int>>& adj, vector<int>& color) {
    color[u] = value;
    for (int v : adj[u]) {
        if (color[v] == -1) {
            // Neighbours must take the opposite parity, hence value ^ 1.
            if (!colorDfs(v, value ^ 1, adj, color)) return false;
        } else if (color[v] == value) {
            // Already coloured the SAME as u: the edge u-v sits inside one class,
            // which means an odd cycle and no valid 2-colouring.
            return false;
        }
    }
    return true;
}

bool isBipartiteDfs(const vector<vector<int>>& adj) {
    int n = (int)adj.size();
    vector<int> color(n, -1);
    // One DFS per component; a graph can be bipartite in one part and not another.
    for (int u = 0; u < n; ++u) {
        if (color[u] == -1 && !colorDfs(u, 0, adj, color)) return false;
    }
    return true;
}

// Witness extraction: an explicit odd cycle proving non-bipartiteness.
vector<int> findOddCycle(const vector<vector<int>>& adj) {
    int n = (int)adj.size();
    vector<int> color(n, -1), parent(n, -1);
    int a = -1, b = -1;

    function<bool(int, int)> dfs = [&](int u, int value) {
        color[u] = value;
        for (int v : adj[u]) {
            if (color[v] == -1) {
                parent[v] = u;
                if (dfs(v, value ^ 1)) return true;
            } else if (color[v] == value) {
                a = u;   // both endpoints share a colour, so the tree path u..v is even
                b = v;
                return true;
            }
        }
        return false;
    };

    for (int u = 0; u < n; ++u) {
        if (color[u] == -1 && dfs(u, 0)) break;
    }
    if (a == -1) return {};

    // Climb from a until b appears on the recorded ancestor path.
    vector<int> path;
    for (int v = a; v != -1; v = parent[v]) {
        path.push_back(v);
        if (v == b) break;
    }
    return path;   // tree path (even length) + the conflicting edge = odd cycle
}`

const TWO_CLIQUE_CPP = `#include <bits/stdc++.h>
using namespace std;

// A graph is the union of two cliques exactly when its COMPLEMENT is bipartite:
// a colour class of the complement has no complement-edges, so in the original
// graph every pair inside it is adjacent, i.e. it is a clique.
bool isTwoCliques(const vector<vector<char>>& g) {
    int n = (int)g.size();

    vector<vector<int>> complement(n);
    for (int i = 0; i < n; ++i) {
        for (int j = i + 1; j < n; ++j) {
            // Missing edge in g becomes an edge in the complement.
            if (!g[i][j]) {
                complement[i].push_back(j);
                complement[j].push_back(i);
            }
        }
    }

    // Standard BFS 2-colouring of the complement.
    vector<int> color(n, -1);
    for (int start = 0; start < n; ++start) {
        if (color[start] != -1) continue;
        color[start] = 0;
        queue<int> q;
        q.push(start);
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            for (int v : complement[u]) {
                if (color[v] == -1) {
                    color[v] = color[u] ^ 1;
                    q.push(v);
                } else if (color[v] == color[u]) {
                    // Odd cycle in the complement => no split into two cliques.
                    return false;
                }
            }
        }
    }
    return true;
}`

/* ------------------------------------------------------------------ */
/* Components, sinks, forests                                          */
/* ------------------------------------------------------------------ */

const COMP_BFS_CPP = `#include <bits/stdc++.h>
using namespace std;

// Count connected components with one BFS per unseen vertex.
int countComponentsBfs(const vector<vector<int>>& adj) {
    int n = (int)adj.size();
    vector<char> seen(n, 0);
    int components = 0;

    for (int start = 0; start < n; ++start) {
        // An unseen vertex is unreachable from every earlier start, so it
        // necessarily opens a brand-new component.
        if (seen[start]) continue;
        ++components;

        queue<int> q;
        seen[start] = 1;
        q.push(start);
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            for (int v : adj[u]) {
                if (!seen[v]) {
                    // Mark on ENQUEUE so a vertex adjacent to two frontier vertices
                    // is still expanded exactly once.
                    seen[v] = 1;
                    q.push(v);
                }
            }
        }
    }
    return components;
}

// Labelled variant: comp[v] = component id, plus the size of each component.
pair<vector<int>, vector<int>> labelComponentsBfs(const vector<vector<int>>& adj) {
    int n = (int)adj.size();
    vector<int> comp(n, -1), sizes;
    for (int start = 0; start < n; ++start) {
        if (comp[start] != -1) continue;
        int id = (int)sizes.size(), count = 0;
        queue<int> q;
        comp[start] = id;   // the label itself is the visited marker
        q.push(start);
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            ++count;
            for (int v : adj[u]) {
                if (comp[v] == -1) {
                    comp[v] = id;
                    q.push(v);
                }
            }
        }
        sizes.push_back(count);
    }
    return {comp, sizes};
}`

const COMP_DFS_CPP = `#include <bits/stdc++.h>
using namespace std;

void markComponent(int u, const vector<vector<int>>& adj, vector<char>& seen) {
    seen[u] = 1;   // mark BEFORE recursing, otherwise a cycle recurses forever
    for (int v : adj[u]) {
        if (!seen[v]) markComponent(v, adj, seen);
    }
}

// For an UNDIRECTED graph, DFS reaches exactly the same vertex set as BFS, so
// the component count is identical; only the visit order differs.
int countComponentsDfs(const vector<vector<int>>& adj) {
    int n = (int)adj.size();
    vector<char> seen(n, 0);
    int components = 0;
    for (int start = 0; start < n; ++start) {
        if (seen[start]) continue;
        ++components;
        markComponent(start, adj, seen);
    }
    return components;
}

// Iterative version: identical result, immune to stack overflow on deep chains.
int countComponentsDfsIterative(const vector<vector<int>>& adj) {
    int n = (int)adj.size();
    vector<char> seen(n, 0);
    int components = 0;
    vector<int> st;

    for (int start = 0; start < n; ++start) {
        if (seen[start]) continue;
        ++components;
        st.push_back(start);
        while (!st.empty()) {
            int u = st.back();
            st.pop_back();
            // Mark on POP here: the same vertex may sit on the stack several times,
            // and only its first pop should expand it.
            if (seen[u]) continue;
            seen[u] = 1;
            for (int v : adj[u]) {
                if (!seen[v]) st.push_back(v);
            }
        }
    }
    return components;
}`

const LARGEST_CPP = `#include <bits/stdc++.h>
using namespace std;

// Flood-fill that returns the area it consumed. Cells are zeroed as they are
// counted, so no cell contributes to two regions.
int regionSize(vector<vector<int>>& grid, int r, int c) {
    if (r < 0 || c < 0 || r >= (int)grid.size() || c >= (int)grid[0].size()) return 0;
    if (grid[r][c] != 1) return 0;

    grid[r][c] = 0;   // sink before recursing, otherwise neighbours count r,c again
    return 1 + regionSize(grid, r + 1, c) + regionSize(grid, r - 1, c)
             + regionSize(grid, r, c + 1) + regionSize(grid, r, c - 1);
}

// Size of the largest 4-connected region of 1s. The grid is consumed.
int largestRegion(vector<vector<int>>& grid) {
    int best = 0;
    for (int r = 0; r < (int)grid.size(); ++r) {
        for (int c = 0; c < (int)grid[0].size(); ++c) {
            // Each surviving 1 starts a fresh region; keep the running maximum.
            if (grid[r][c] == 1) best = max(best, regionSize(grid, r, c));
        }
    }
    return best;
}

// 8-connected variant: the only change is the neighbour set.
int largestRegionDiagonal(vector<vector<int>>& grid) {
    int rows = (int)grid.size(), cols = (int)grid[0].size();
    const int dirs[8][2] = {{1, 0}, {-1, 0}, {0, 1}, {0, -1},
                            {1, 1}, {1, -1}, {-1, 1}, {-1, -1}};
    int best = 0;
    for (int sr = 0; sr < rows; ++sr) {
        for (int sc = 0; sc < cols; ++sc) {
            if (grid[sr][sc] != 1) continue;
            int area = 0;
            vector<pair<int, int>> st{{sr, sc}};
            grid[sr][sc] = 0;
            while (!st.empty()) {
                auto [r, c] = st.back();
                st.pop_back();
                ++area;
                for (auto& d : dirs) {
                    int nr = r + d[0], nc = c + d[1];
                    if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
                    if (grid[nr][nc] != 1) continue;
                    grid[nr][nc] = 0;   // mark on push, not on pop
                    st.push_back({nr, nc});
                }
            }
            best = max(best, area);
        }
    }
    return best;
}`

const FOREST_CPP = `#include <bits/stdc++.h>
using namespace std;

// A component is a tree iff it is connected and has |V_comp| - 1 edges, which is
// the same as saying its traversal finds no back edge.
bool isTreeComponent(int start, const vector<vector<int>>& adj, vector<char>& seen) {
    queue<pair<int, int>> q;   // {vertex, parent}
    q.push({start, -1});
    seen[start] = 1;

    long long endpoints = 0;   // counts each undirected edge twice
    long long nodes = 0;

    while (!q.empty()) {
        int u = q.front().first, parent = q.front().second;
        q.pop();
        ++nodes;
        for (int v : adj[u]) {
            ++endpoints;
            if (!seen[v]) {
                seen[v] = 1;
                q.push({v, u});
            } else if (v != parent) {
                // Skipping only the parent edge is what separates "the reverse copy
                // of the edge we came in on" from a real back edge.
                return false;
            }
        }
    }

    return endpoints / 2 == nodes - 1;   // edge/vertex identity for a tree
}

// Number of tree components in an undirected graph, or -1 when some component
// contains a cycle (so the graph is not a forest at all).
int countTreesInForest(const vector<vector<int>>& adj) {
    vector<char> seen(adj.size(), 0);
    int trees = 0;
    for (int start = 0; start < (int)adj.size(); ++start) {
        if (seen[start]) continue;
        if (!isTreeComponent(start, adj, seen)) return -1;
        ++trees;
    }
    return trees;
}`

const UNI_SINK_CPP = `#include <bits/stdc++.h>
using namespace std;

// Universal sink: out-degree 0 and in-degree V-1. There can be at most one.
// The walk below finds the only possible candidate in O(V) matrix probes.
int findUniversalSink(const vector<vector<char>>& g) {
    int n = (int)g.size();
    int i = 0, j = 0;

    while (i < n && j < n) {
        if (g[i][j]) {
            // i has an outgoing edge, so i cannot be a sink. Every row before i is
            // already eliminated, so advancing i never skips the answer.
            ++i;
        } else {
            // No edge i->j means j has no incoming edge from i, so j cannot have
            // in-degree V-1 and is eliminated instead.
            ++j;
        }
    }
    if (i == n) return -1;   // every candidate was eliminated

    // The walk only PROPOSES a candidate; it must still be verified in O(V).
    for (int k = 0; k < n; ++k) {
        if (k == i) continue;
        if (g[i][k]) return -1;    // candidate has an outgoing edge
        if (!g[k][i]) return -1;   // candidate is missing an incoming edge
    }
    return i;
}`

const NUM_SINKS_CPP = `#include <bits/stdc++.h>
using namespace std;

// A sink has out-degree 0, i.e. an empty adjacency row.
int countSinks(const vector<vector<int>>& adj) {
    int sinks = 0;
    for (const auto& row : adj) {
        if (row.empty()) ++sinks;
    }
    return sinks;
}

vector<int> listSinks(const vector<vector<int>>& adj) {
    vector<int> sinks;
    for (int u = 0; u < (int)adj.size(); ++u) {
        if (adj[u].empty()) sinks.push_back(u);
    }
    return sinks;
}

// From an edge list the out-degree must be counted explicitly; note that an
// isolated vertex has out-degree 0 too and therefore counts as a sink.
int countSinksFromEdges(int V, const vector<pair<int, int>>& edges) {
    vector<int> outdeg(V, 0);
    for (const auto& e : edges) ++outdeg[e.first];
    int sinks = 0;
    for (int u = 0; u < V; ++u) {
        if (outdeg[u] == 0) ++sinks;
    }
    return sinks;
}

// Sources are the mirror image: in-degree 0.
int countSources(int V, const vector<pair<int, int>>& edges) {
    vector<int> indeg(V, 0);
    for (const auto& e : edges) ++indeg[e.second];
    int sources = 0;
    for (int u = 0; u < V; ++u) {
        if (indeg[u] == 0) ++sources;
    }
    return sources;
}`

/* ------------------------------------------------------------------ */
/* Disjoint set union                                                  */
/* ------------------------------------------------------------------ */

const DSU_PC_CPP = `#include <bits/stdc++.h>
using namespace std;

// Path compression alone already gives O(log n) amortised per operation; adding
// union by rank/size brings it down to inverse-Ackermann.
struct DsuPathCompression {
    vector<int> parent;

    explicit DsuPathCompression(int n) : parent(n) {
        iota(parent.begin(), parent.end(), 0);   // every element starts as its own root
    }

    int find(int x) {
        // The assignment inside the return is the compression: as the recursion
        // unwinds, EVERY node on the query path is re-pointed straight at the
        // root, so the same path is never walked twice.
        return parent[x] == x ? x : parent[x] = find(parent[x]);
    }

    // Iterative two-pass variant for very deep trees (no recursion depth risk).
    int findIterative(int x) {
        int root = x;
        while (parent[root] != root) root = parent[root];
        while (parent[x] != root) {
            int next = parent[x];
            parent[x] = root;   // second pass rewires the path
            x = next;
        }
        return root;
    }

    bool unite(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false;   // already together => this link is redundant
        parent[ra] = rb;
        return true;
    }

    bool connected(int a, int b) { return find(a) == find(b); }
};`

const DSU_RANK_CPP = `#include <bits/stdc++.h>
using namespace std;

struct DsuUnionByRank {
    vector<int> parent;
    vector<int> rnk;   // rank = upper bound on the tree height, NOT the element count

    explicit DsuUnionByRank(int n) : parent(n), rnk(n, 0) {
        iota(parent.begin(), parent.end(), 0);
    }

    int find(int x) {
        return parent[x] == x ? x : parent[x] = find(parent[x]);
    }

    bool unite(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false;

        // Hang the SHORTER tree under the taller one: the combined height is then
        // max(h1, h2) instead of h1 + 1, which keeps find paths short.
        if (rnk[ra] < rnk[rb]) swap(ra, rb);
        parent[rb] = ra;

        // The height can only grow when both trees were exactly as tall, because
        // only then does the shorter one add a level below the new root.
        if (rnk[ra] == rnk[rb]) ++rnk[ra];
        return true;
    }

    bool connected(int a, int b) { return find(a) == find(b); }
};`

const DSU_SIZE_CPP = `#include <bits/stdc++.h>
using namespace std;

struct DsuUnionBySize {
    vector<int> parent;
    vector<int> compSize;   // exact element count, so component-size queries are free
    int components;

    explicit DsuUnionBySize(int n) : parent(n), compSize(n, 1), components(n) {
        iota(parent.begin(), parent.end(), 0);
    }

    int find(int x) {
        return parent[x] == x ? x : parent[x] = find(parent[x]);
    }

    bool unite(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false;

        // Attach the smaller set under the larger one. Each element's depth then
        // only increases when its set at least doubles, so no element can move
        // down more than log n times.
        if (compSize[ra] < compSize[rb]) swap(ra, rb);
        parent[rb] = ra;
        compSize[ra] += compSize[rb];
        --components;
        return true;
    }

    // Sizes are what rank cannot give you: rank is only a height bound.
    int sizeOf(int x) { return compSize[find(x)]; }

    int componentCount() const { return components; }

    int largestComponent() {
        int best = 0;
        for (int i = 0; i < (int)parent.size(); ++i) {
            if (find(i) == i) best = max(best, compSize[i]);
        }
        return best;
    }
};`

const DSU_GRID_CPP = `#include <bits/stdc++.h>
using namespace std;

struct Dsu {
    vector<int> parent, compSize;

    explicit Dsu(int n) : parent(n), compSize(n, 1) {
        iota(parent.begin(), parent.end(), 0);
    }

    int find(int x) { return parent[x] == x ? x : parent[x] = find(parent[x]); }

    bool unite(int a, int b) {
        a = find(a);
        b = find(b);
        if (a == b) return false;
        if (compSize[a] < compSize[b]) swap(a, b);
        parent[b] = a;
        compSize[a] += compSize[b];
        return true;
    }
};

// Number of Islands II: land cells appear one at a time; report the island count
// after each addition. BFS-per-query would be O(k * rows * cols); DSU is near O(k).
vector<int> numIslandsOnline(int rows, int cols, const vector<pair<int, int>>& positions) {
    Dsu dsu(rows * cols);
    vector<char> land((size_t)rows * cols, 0);
    const int dirs[4][2] = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

    int islands = 0;
    vector<int> answer;
    answer.reserve(positions.size());

    for (const auto& p : positions) {
        // Row-major flattening (r*cols + c) is what lets a grid share the plain
        // integer DSU with no hashing at all.
        int id = p.first * cols + p.second;
        if (land[id]) {                 // duplicate insertion: count is unchanged
            answer.push_back(islands);
            continue;
        }
        land[id] = 1;
        ++islands;                      // optimistically a new island of its own

        for (auto& d : dirs) {
            int nr = p.first + d[0], nc = p.second + d[1];
            if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
            int nid = nr * cols + nc;
            // Each successful union merges two previously separate islands, so the
            // count drops by exactly one. unite() returning false means they were
            // already the same island (a diagonal-free loop), and nothing changes.
            if (land[nid] && dsu.unite(id, nid)) --islands;
        }
        answer.push_back(islands);
    }
    return answer;
}`

const DYN_CONN_CPP = `#include <bits/stdc++.h>
using namespace std;

// Incremental connectivity: edges are only ADDED, queries ask whether two
// vertices are in the same component. DSU answers both in near-constant time.
struct DynamicConnectivity {
    vector<int> parent, rnk;
    int components;

    explicit DynamicConnectivity(int n) : parent(n), rnk(n, 0), components(n) {
        iota(parent.begin(), parent.end(), 0);
    }

    int find(int x) {
        return parent[x] == x ? x : parent[x] = find(parent[x]);
    }

    // Returns true when this edge actually merged two components.
    bool addEdge(int u, int v) {
        int ru = find(u), rv = find(v);
        if (ru == rv) return false;   // edge inside one component: connectivity unchanged
        if (rnk[ru] < rnk[rv]) swap(ru, rv);
        parent[rv] = ru;
        if (rnk[ru] == rnk[rv]) ++rnk[ru];
        --components;
        return true;
    }

    bool connected(int u, int v) { return find(u) == find(v); }

    int componentCount() const { return components; }
};

// DELETIONS are the hard direction: path compression destroys the information
// needed to undo a union. The usual fix is a DSU WITHOUT compression (union by
// size only, so find is O(log n)) plus a rollback log, which then supports the
// offline divide-and-conquer over the query timeline.
struct RollbackDsu {
    vector<int> parent, compSize;
    vector<int> history;   // roots that were attached, newest last
    int components;

    explicit RollbackDsu(int n) : parent(n), compSize(n, 1), components(n) {
        iota(parent.begin(), parent.end(), 0);
    }

    // No compression here on purpose: the parent pointers must stay exactly as
    // they were so a rollback can restore them.
    int find(int x) const {
        while (parent[x] != x) x = parent[x];
        return x;
    }

    bool unite(int a, int b) {
        a = find(a);
        b = find(b);
        if (a == b) return false;
        if (compSize[a] < compSize[b]) swap(a, b);
        parent[b] = a;
        compSize[a] += compSize[b];
        history.push_back(b);   // one entry per real merge
        --components;
        return true;
    }

    void rollback() {
        if (history.empty()) return;
        int b = history.back();
        history.pop_back();
        compSize[parent[b]] -= compSize[b];
        parent[b] = b;
        ++components;
    }
};`

/* ------------------------------------------------------------------ */
/* Shortest paths                                                      */
/* ------------------------------------------------------------------ */

const DIJK_PQ_CPP = `#include <bits/stdc++.h>
using namespace std;

const long long INF = LLONG_MAX / 4;   // /4 leaves headroom so INF + w cannot overflow

// adj[u] holds {v, w} with w >= 0. Lazy binary-heap Dijkstra.
vector<long long> dijkstraPriorityQueue(int src, const vector<vector<pair<int, int>>>& adj) {
    int n = (int)adj.size();
    vector<long long> dist(n, INF);
    dist[src] = 0;

    // A binary heap has no cheap decrease-key, so instead of updating a key we
    // PUSH an improved copy and discard the outdated ones on pop. The heap holds
    // O(E) entries, which still gives O(E log V) overall.
    using Item = pair<long long, int>;   // {distance, vertex}
    priority_queue<Item, vector<Item>, greater<Item>> pq;   // greater<> => min-heap
    pq.push({0LL, src});

    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();

        // Stale entry: u was already settled with a smaller key. This one line is
        // what keeps every vertex EXPANDED exactly once despite the duplicates.
        if (d > dist[u]) continue;

        for (auto& [v, w] : adj[u]) {
            long long candidate = d + w;   // long long: 1e5 edges of weight 1e9 overflows int
            if (candidate < dist[v]) {
                dist[v] = candidate;   // relax first, then publish the new key
                pq.push({candidate, v});
            }
        }
    }
    return dist;
}

// Eager alternative: an indexed heap or a set gives real decrease-key and keeps
// the heap at O(V) entries, which only matters on very dense graphs.
long long shortestDistance(int src, int dst, const vector<vector<pair<int, int>>>& adj) {
    return dijkstraPriorityQueue(src, adj)[dst];
}`

const DIJK_SET_CPP = `#include <bits/stdc++.h>
using namespace std;

const long long INF = LLONG_MAX / 4;

// Dijkstra with an ordered set (balanced BST) instead of a heap. The set gives a
// genuine decrease-key: erase the old {dist, vertex} pair and insert the new one,
// so the container never holds more than V entries.
vector<long long> dijkstraSet(int src, const vector<vector<pair<int, int>>>& adj) {
    int n = (int)adj.size();
    vector<long long> dist(n, INF);
    dist[src] = 0;

    // The vertex id is part of the key so distinct vertices with equal distance
    // are still distinct set elements; keying on distance alone would lose them.
    set<pair<long long, int>> active;
    active.insert({0LL, src});

    while (!active.empty()) {
        auto it = active.begin();
        int u = it->second;
        long long d = it->first;
        // begin() is the smallest tentative distance, and with nonnegative weights
        // no later path can improve it, so u is final on extraction.
        active.erase(it);

        for (auto& [v, w] : adj[u]) {
            if (d + w < dist[v]) {
                // Remove the OLD key before writing the new distance, otherwise the
                // obsolete pair stays in the set and would be extracted later.
                if (dist[v] != INF) active.erase({dist[v], v});
                dist[v] = d + w;
                active.insert({dist[v], v});
            }
        }
    }
    return dist;
}`

const DIJK_PATH_CPP = `#include <bits/stdc++.h>
using namespace std;

const long long INF = LLONG_MAX / 4;

// One shortest src->dst path as a vertex list, or empty when unreachable.
vector<int> dijkstraShortestPath(int src, int dst, const vector<vector<pair<int, int>>>& adj) {
    int n = (int)adj.size();
    vector<long long> dist(n, INF);
    vector<int> parent(n, -1);
    dist[src] = 0;

    using Item = pair<long long, int>;
    priority_queue<Item, vector<Item>, greater<Item>> pq;
    pq.push({0LL, src});

    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();
        if (d > dist[u]) continue;      // stale heap entry
        if (u == dst) break;            // dst is settled; nothing later can improve it

        for (auto& [v, w] : adj[u]) {
            if (d + w < dist[v]) {
                dist[v] = d + w;
                // Record the parent on the SAME line as the successful relaxation.
                // Setting it anywhere else can leave a pointer that belongs to a
                // route which was later beaten, producing a non-shortest path.
                parent[v] = u;
                pq.push({dist[v], v});
            }
        }
    }

    if (dist[dst] == INF) return {};

    // Walk parents backwards from dst, then reverse into src -> dst order.
    vector<int> path;
    for (int v = dst; v != -1; v = parent[v]) path.push_back(v);
    reverse(path.begin(), path.end());
    return path;
}

// Counting shortest paths needs the tie case, which the strict < above skips.
vector<long long> countShortestPaths(int src, const vector<vector<pair<int, int>>>& adj) {
    int n = (int)adj.size();
    vector<long long> dist(n, INF), ways(n, 0);
    dist[src] = 0;
    ways[src] = 1;

    using Item = pair<long long, int>;
    priority_queue<Item, vector<Item>, greater<Item>> pq;
    pq.push({0LL, src});
    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();
        if (d > dist[u]) continue;
        for (auto& [v, w] : adj[u]) {
            if (d + w < dist[v]) {
                dist[v] = d + w;
                ways[v] = ways[u];        // strictly better route: replace the count
                pq.push({dist[v], v});
            } else if (d + w == dist[v]) {
                ways[v] += ways[u];       // equally good route: accumulate
            }
        }
    }
    return ways;
}`

const DIJK_LIMITS_CPP = `#include <bits/stdc++.h>
using namespace std;

const long long INF = LLONG_MAX / 4;

struct Edge {
    int u, v, w;
};

// Textbook Dijkstra. The settled[] flag IS the algorithm: popping the smallest
// key is treated as FINAL, so a vertex is never reconsidered. That step is the
// entire source of the O((V + E) log V) bound, and its proof needs w >= 0.
vector<long long> dijkstraSettleOnPop(int src, const vector<vector<pair<int, int>>>& adj) {
    int n = (int)adj.size();
    vector<long long> dist(n, INF);
    vector<char> settled(n, 0);
    dist[src] = 0;

    using Item = pair<long long, int>;
    priority_queue<Item, vector<Item>, greater<Item>> pq;
    pq.push({0LL, src});
    while (!pq.empty()) {
        int u = pq.top().second;
        pq.pop();
        if (settled[u]) continue;
        settled[u] = 1;   // u is declared final here — this is exactly what breaks

        for (auto& [v, w] : adj[u]) {
            if (settled[v]) continue;   // a negative edge into a settled vertex is IGNORED
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}

// Bellman-Ford: the correct replacement. It relaxes every edge V-1 times instead
// of trusting a popped minimum, so negative edges are handled properly.
bool bellmanFord(int n, const vector<Edge>& edges, int src, vector<long long>& dist) {
    dist.assign(n, INF);
    dist[src] = 0;
    for (int round = 0; round < n - 1; ++round) {
        bool changed = false;
        for (const Edge& e : edges) {
            if (dist[e.u] == INF) continue;
            if (dist[e.u] + e.w < dist[e.v]) {
                dist[e.v] = dist[e.u] + e.w;
                changed = true;
            }
        }
        if (!changed) break;
    }
    for (const Edge& e : edges) {
        if (dist[e.u] != INF && dist[e.u] + e.w < dist[e.v]) return false;   // negative cycle
    }
    return true;
}

// Concrete counterexample. Note there is NO negative cycle here: a single
// negative edge is already enough to break Dijkstra.
//
//   0 -> 1  weight  2
//   0 -> 2  weight  5
//   2 -> 1  weight -4
//
// The true shortest 0->1 is 5 + (-4) = 1. Dijkstra pops vertex 1 first (key 2),
// declares it final, and by the time vertex 2 is expanded the -4 edge points at
// an already-settled vertex and is skipped.
void demonstrateDijkstraFailure() {
    const int n = 3;
    vector<vector<pair<int, int>>> adj(n);
    adj[0].push_back({1, 2});
    adj[0].push_back({2, 5});
    adj[2].push_back({1, -4});

    vector<long long> greedy = dijkstraSettleOnPop(0, adj);
    // greedy[1] == 2  -> WRONG by 1.

    vector<Edge> edges = {{0, 1, 2}, {0, 2, 5}, {2, 1, -4}};
    vector<long long> correct;
    bellmanFord(n, edges, 0, correct);
    // correct[1] == 1  -> RIGHT: the V-1 relaxation rounds still improve vertex 1.

    assert(greedy[1] == 2);
    assert(correct[1] == 1);
}

// A tempting non-fix: drop settled[] and re-push any vertex that improves. That
// variant does converge to the right answer when no negative cycle exists, but
// it is no longer Dijkstra — a vertex can be expanded many times and the work
// becomes exponential in the worst case. If you are paying that price, use
// Bellman-Ford (or SPFA) deliberately, and get negative-cycle detection with it.

// Decision table encoded as code: pick by the weight model, not by familiarity.
//   unweighted / all weights equal .......... BFS,                 O(V + E)
//   weights only 0 or 1 ..................... 0-1 BFS with deque,  O(V + E)
//   weighted DAG (negatives allowed) ........ topological sweep,   O(V + E)
//   all weights >= 0 ........................ Dijkstra,            O((V+E) log V)
//   any negative edge ....................... Bellman-Ford,        O(V * E)
//   all pairs, moderate V ................... Floyd-Warshall,      O(V^3)`

const DIALS_CPP = `#include <bits/stdc++.h>
using namespace std;

// Dial's algorithm: Dijkstra with bucket queues. Valid when every edge weight is
// an integer in [0..W]; it replaces the log factor with a linear bucket scan.
vector<int> dialShortestPaths(int src, const vector<vector<pair<int, int>>>& adj, int W) {
    int n = (int)adj.size();
    const int UNREACHED = INT_MAX;
    vector<int> dist(n, UNREACHED);

    // Any simple path uses at most V-1 edges of weight at most W, so every finite
    // distance fits in 0..(V-1)*W and that many buckets suffice.
    long long maxDist = 1LL * (n - 1) * W;
    vector<deque<int>> buckets((size_t)maxDist + 1);

    dist[src] = 0;
    buckets[0].push_back(src);

    long long idx = 0;
    while (idx <= maxDist) {
        // The scan index never moves BACKWARDS: relaxations can only ever produce
        // a key >= the current one, which is exactly Dijkstra's monotonicity and
        // is why the total scan cost is O(V*W) rather than quadratic.
        if (buckets[idx].empty()) {
            ++idx;
            continue;
        }

        int u = buckets[idx].front();
        buckets[idx].pop_front();
        // Lazy deletion: an improved copy of u was filed in an earlier bucket, so
        // this entry is stale and must not be expanded again.
        if (dist[u] != idx) continue;

        for (auto& [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                buckets[dist[v]].push_back(v);   // file v under its new key
            }
        }
    }
    return dist;
}`

const DESOPO_CPP = `#include <bits/stdc++.h>
using namespace std;

const long long INF = LLONG_MAX / 4;

// D'Esopo-Pape: a deque-based hybrid of Bellman-Ford and Dijkstra. Handles
// negative edges (but not negative cycles) and is fast on typical inputs, though
// its worst case is exponential — use SPFA or Bellman-Ford for adversarial data.
vector<long long> desopoPape(int src, const vector<vector<pair<int, int>>>& adj) {
    int n = (int)adj.size();
    vector<long long> dist(n, INF);
    vector<int> state(n, 0);   // 0 = never queued, 1 = in deque, 2 = removed before

    deque<int> dq;
    dist[src] = 0;
    dq.push_back(src);
    state[src] = 1;

    while (!dq.empty()) {
        int u = dq.front();
        dq.pop_front();
        state[u] = 2;

        for (auto& [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                if (state[v] == 0) {
                    // Never seen: append it like ordinary Bellman-Ford queueing.
                    dq.push_back(v);
                    state[v] = 1;
                } else if (state[v] == 2) {
                    // Already processed once and now improved again. Pushing it to
                    // the FRONT re-propagates the correction immediately instead of
                    // waiting a whole pass, which is the entire trick of the method.
                    dq.push_front(v);
                    state[v] = 1;
                }
                // state == 1 means v is already pending; no second entry needed.
            }
        }
    }
    return dist;
}`

const BF_REL_CPP = `#include <bits/stdc++.h>
using namespace std;

const long long INF = LLONG_MAX / 4;

struct Edge {
    int u, v, w;
};

// Single-source shortest paths with negative edges allowed (assumes no negative
// cycle is reachable from src). Relaxation is the whole algorithm.
vector<long long> bellmanFordRelaxation(int n, int src, const vector<Edge>& edges) {
    vector<long long> dist(n, INF);
    dist[src] = 0;

    // Invariant: after round i, every shortest path using at most i edges is
    // correct. A simple shortest path uses at most n-1 edges, hence n-1 rounds.
    for (int round = 0; round < n - 1; ++round) {
        bool changed = false;
        for (const Edge& e : edges) {
            // Relaxing out of INF would manufacture bogus finite distances
            // (INF + w is still huge but no longer means "unreachable").
            if (dist[e.u] == INF) continue;
            if (dist[e.u] + e.w < dist[e.v]) {
                dist[e.v] = dist[e.u] + e.w;
                changed = true;
            }
        }
        // No relaxation succeeded => the fixed point is reached and later rounds
        // cannot change anything. Very common early exit on real inputs.
        if (!changed) break;
    }
    return dist;
}

// SPFA: the same relaxation restricted to vertices whose distance just improved.
// Same worst case O(V*E), usually far faster in practice.
vector<long long> spfa(int n, int src, const vector<vector<pair<int, int>>>& adj) {
    vector<long long> dist(n, INF);
    vector<char> inQueue(n, 0);
    dist[src] = 0;

    queue<int> q;
    q.push(src);
    inQueue[src] = 1;
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        inQueue[u] = 0;
        for (auto& [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                // Only enqueue when not already pending: a vertex needs one slot,
                // however many of its incoming edges improved it.
                if (!inQueue[v]) {
                    q.push(v);
                    inQueue[v] = 1;
                }
            }
        }
    }
    return dist;
}`

const BF_NEG_CPP = `#include <bits/stdc++.h>
using namespace std;

const long long INF = LLONG_MAX / 4;

struct Edge {
    int u, v, w;
};

// Returns false (leaving dist unusable) when a negative cycle is REACHABLE from
// src; otherwise fills dist with the true shortest distances.
bool bellmanFordDetectNegativeCycle(int n, int src, const vector<Edge>& edges,
                                    vector<long long>& dist) {
    dist.assign(n, INF);
    dist[src] = 0;

    for (int round = 0; round < n - 1; ++round) {
        for (const Edge& e : edges) {
            if (dist[e.u] == INF) continue;
            if (dist[e.u] + e.w < dist[e.v]) dist[e.v] = dist[e.u] + e.w;
        }
    }

    // The V-th pass is the detector. After n-1 rounds every SIMPLE path is already
    // optimal, so a further improvement must come from repeating a cycle, and only
    // a negative-weight cycle can make repetition profitable.
    for (const Edge& e : edges) {
        if (dist[e.u] != INF && dist[e.u] + e.w < dist[e.v]) return false;
    }
    return true;
}

// Mark every vertex whose distance is undefined because a negative cycle can
// reach it. Distances outside that set remain valid and usable.
vector<char> verticesAffectedByNegativeCycle(int n, int src, const vector<Edge>& edges) {
    vector<long long> dist(n, INF);
    dist[src] = 0;
    for (int round = 0; round < n - 1; ++round) {
        for (const Edge& e : edges) {
            if (dist[e.u] != INF && dist[e.u] + e.w < dist[e.v]) dist[e.v] = dist[e.u] + e.w;
        }
    }

    vector<char> affected(n, 0);
    for (const Edge& e : edges) {
        if (dist[e.u] != INF && dist[e.u] + e.w < dist[e.v]) affected[e.v] = 1;
    }

    // Anything downstream of an affected vertex is equally unbounded, so propagate
    // the flag forward with n-1 more sweeps (or one BFS on the same edge set).
    for (int round = 0; round < n - 1; ++round) {
        for (const Edge& e : edges) {
            if (affected[e.u]) affected[e.v] = 1;
        }
    }
    return affected;
}`

const FLOYD_CPP = `#include <bits/stdc++.h>
using namespace std;

// dist[i][j] starts as the direct edge weight (INF when absent, 0 on the
// diagonal) and is rewritten in place into all-pairs shortest distances.
// Negative edges are fine; a negative cycle shows up as dist[i][i] < 0.
void floydWarshallAllPairs(vector<vector<long long>>& dist, long long INF) {
    int n = (int)dist.size();

    // k is the DP layer "paths whose intermediate vertices come from {0..k}", so
    // it MUST be the outermost loop. Swapping the loops uses half-updated rows
    // and produces silently wrong distances.
    for (int k = 0; k < n; ++k) {
        for (int i = 0; i < n; ++i) {
            // No i->k leg means this entire row gains nothing from layer k.
            if (dist[i][k] >= INF) continue;
            for (int j = 0; j < n; ++j) {
                if (dist[k][j] >= INF) continue;   // guard against INF + INF arithmetic
                long long through = dist[i][k] + dist[k][j];
                if (through < dist[i][j]) dist[i][j] = through;
            }
        }
    }
}

// Path reconstruction: next[i][j] = first hop of a shortest i->j path.
vector<vector<int>> floydWarshallWithPaths(vector<vector<long long>>& dist, long long INF) {
    int n = (int)dist.size();
    vector<vector<int>> nextHop(n, vector<int>(n, -1));
    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < n; ++j) {
            if (i != j && dist[i][j] < INF) nextHop[i][j] = j;
        }
    }
    for (int k = 0; k < n; ++k) {
        for (int i = 0; i < n; ++i) {
            if (dist[i][k] >= INF) continue;
            for (int j = 0; j < n; ++j) {
                if (dist[k][j] >= INF) continue;
                if (dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                    // Routing through k means the first hop of i->j becomes the
                    // first hop of i->k.
                    nextHop[i][j] = nextHop[i][k];
                }
            }
        }
    }
    return nextHop;
}

// A vertex on a negative cycle reaches itself at negative cost.
bool hasNegativeCycle(const vector<vector<long long>>& dist) {
    for (int i = 0; i < (int)dist.size(); ++i) {
        if (dist[i][i] < 0) return true;
    }
    return false;
}`

const JOHNSON_CPP = `#include <bits/stdc++.h>
using namespace std;

const long long INF = LLONG_MAX / 4;

struct Edge {
    int u, v, w;
};

// Johnson: all-pairs shortest paths with negative edges in O(V*E + V*E log V),
// which beats Floyd-Warshall on sparse graphs. The trick is REWEIGHTING.
vector<vector<long long>> johnsonAllPairs(int V, const vector<Edge>& edges) {
    // Step 1: add a virtual source V with a zero-cost edge to every vertex, so
    // every vertex is reachable and Bellman-Ford can compute a potential h[].
    vector<Edge> augmented = edges;
    for (int v = 0; v < V; ++v) augmented.push_back({V, v, 0});

    vector<long long> h(V + 1, INF);
    h[V] = 0;
    for (int round = 0; round < V; ++round) {
        for (const Edge& e : augmented) {
            if (h[e.u] != INF && h[e.u] + e.w < h[e.v]) h[e.v] = h[e.u] + e.w;
        }
    }
    for (const Edge& e : augmented) {
        if (h[e.u] != INF && h[e.u] + e.w < h[e.v]) return {};   // negative cycle: undefined
    }

    // Step 2: reweight w' = w + h[u] - h[v]. Because h satisfies the triangle
    // inequality h[v] <= h[u] + w, every w' is >= 0, so Dijkstra becomes legal.
    // The telescoping h terms also keep the ORDER of paths unchanged, which is
    // why the transformation preserves shortest paths rather than just signs.
    vector<vector<pair<int, long long>>> adj(V);
    for (const Edge& e : edges) adj[e.u].push_back({e.v, e.w + h[e.u] - h[e.v]});

    vector<vector<long long>> result(V, vector<long long>(V, INF));
    for (int s = 0; s < V; ++s) {
        vector<long long> dist(V, INF);
        dist[s] = 0;
        using Item = pair<long long, int>;
        priority_queue<Item, vector<Item>, greater<Item>> pq;
        pq.push({0LL, s});
        while (!pq.empty()) {
            auto [d, u] = pq.top();
            pq.pop();
            if (d > dist[u]) continue;
            for (auto& [v, w] : adj[u]) {
                if (d + w < dist[v]) {
                    dist[v] = d + w;
                    pq.push({dist[v], v});
                }
            }
        }
        // Step 3: undo the potential to recover true distances.
        for (int t = 0; t < V; ++t) {
            result[s][t] = dist[t] == INF ? INF : dist[t] - h[s] + h[t];
        }
    }
    return result;
}`

const MULTI_STAGE_CPP = `#include <bits/stdc++.h>
using namespace std;

const int INF = INT_MAX / 4;

// Multistage graph: vertices are grouped into stages and every edge goes from
// stage i to stage i+1, so vertices can be numbered so that edges only ever
// point FORWARD. cost[i][j] = weight of i->j, or INF when absent.
int multistageShortest(const vector<vector<int>>& cost) {
    int n = (int)cost.size();
    vector<int> dp(n, INF);
    dp[n - 1] = 0;   // the sink costs nothing to reach from itself

    // Backwards DP. Because every edge points forward, dp[j] for all j > i is
    // already final when i is processed, so one pass per vertex is enough — no
    // priority queue and no relaxation rounds.
    for (int i = n - 2; i >= 0; --i) {
        for (int j = i + 1; j < n; ++j) {
            if (cost[i][j] >= INF) continue;
            if (dp[j] >= INF) continue;   // j cannot reach the sink, so neither can this edge
            dp[i] = min(dp[i], cost[i][j] + dp[j]);
        }
    }
    return dp[0];
}

// Same DP, plus the chosen stage-by-stage route.
vector<int> multistagePath(const vector<vector<int>>& cost) {
    int n = (int)cost.size();
    vector<int> dp(n, INF), nextVertex(n, -1);
    dp[n - 1] = 0;
    for (int i = n - 2; i >= 0; --i) {
        for (int j = i + 1; j < n; ++j) {
            if (cost[i][j] >= INF || dp[j] >= INF) continue;
            if (cost[i][j] + dp[j] < dp[i]) {
                dp[i] = cost[i][j] + dp[j];
                nextVertex[i] = j;   // remember the decision, not just its value
            }
        }
    }
    vector<int> path;
    for (int v = 0; v != -1; v = nextVertex[v]) path.push_back(v);
    return path;
}`

const BIN_GRAPH_CPP = `#include <bits/stdc++.h>
using namespace std;

// adj[u] holds {v, w} with w in {0, 1}. Deque replaces the heap entirely.
vector<int> zeroOneBfs(int src, const vector<vector<pair<int, int>>>& adj) {
    int n = (int)adj.size();
    vector<int> dist(n, INT_MAX);
    dist[src] = 0;

    deque<int> dq;
    dq.push_front(src);

    while (!dq.empty()) {
        int u = dq.front();
        dq.pop_front();
        for (auto& [v, w] : adj[u]) {
            // The relax test also filters stale deque entries, so no visited[] is
            // needed: an outdated copy of v simply fails to improve anything.
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                // A 0-edge keeps v in the CURRENT distance layer, so it belongs at
                // the front; a 1-edge moves it to the next layer, so it belongs at
                // the back. That makes the deque behave as a 2-bucket priority
                // queue, and the keys inside it never differ by more than 1.
                if (w == 0) dq.push_front(v);
                else dq.push_back(v);
            }
        }
    }
    return dist;
}

// Typical framing: minimum number of "expensive" transitions, where free moves
// are weight 0 and paid moves are weight 1.
int minimumPaidMoves(int src, int dst, const vector<vector<pair<int, int>>>& adj) {
    vector<int> dist = zeroOneBfs(src, adj);
    return dist[dst] == INT_MAX ? -1 : dist[dst];
}`

const MEAN_CYCLE_CPP = `#include <bits/stdc++.h>
using namespace std;

// Karp's minimum mean cycle. edges hold {u, v, w}; the graph should be strongly
// connected (otherwise run it per SCC).
//
// dp[k][v] = minimum weight of a walk of EXACTLY k edges ending at v. Karp's
// theorem: min mean = min over v of max over k<V of (dp[V][v] - dp[k][v])/(V-k).
double minimumMeanCycle(int V, const vector<array<int, 3>>& edges) {
    const double POS = numeric_limits<double>::infinity();
    vector<vector<double>> dp(V + 1, vector<double>(V, POS));
    // A single fixed start suffices for a strongly connected graph, since every
    // cycle is reachable from vertex 0.
    dp[0][0] = 0;

    // Exactly k edges, so there is no "keep the shorter walk" option here — the
    // edge count is part of the state, which is what makes the ratio well defined.
    for (int k = 1; k <= V; ++k) {
        for (const auto& e : edges) {
            if (dp[k - 1][e[0]] == POS) continue;
            dp[k][e[1]] = min(dp[k][e[1]], dp[k - 1][e[0]] + e[2]);
        }
    }

    double answer = POS;
    for (int v = 0; v < V; ++v) {
        if (dp[V][v] == POS) continue;
        double worst = -POS;
        for (int k = 0; k < V; ++k) {
            if (dp[k][v] == POS) continue;
            // The inner MAX is what removes the non-cyclic prefix of the V-edge
            // walk; only the cyclic part survives the worst-case k.
            worst = max(worst, (dp[V][v] - dp[k][v]) / (V - k));
        }
        answer = min(answer, worst);
    }
    return answer;
}

// Related use: a graph has a negative cycle exactly when its minimum mean
// cycle weight is negative, which also gives the "most negative" cycle density.
bool hasNegativeCycleByMean(int V, const vector<array<int, 3>>& edges) {
    return minimumMeanCycle(V, edges) < 0;
}`

/* ------------------------------------------------------------------ */
/* Spanning trees                                                      */
/* ------------------------------------------------------------------ */

const CONNECT_CITIES_CPP = `#include <bits/stdc++.h>
using namespace std;

struct Dsu {
    vector<int> parent, rnk;

    explicit Dsu(int n) : parent(n), rnk(n, 0) {
        iota(parent.begin(), parent.end(), 0);
    }

    int find(int x) { return parent[x] == x ? x : parent[x] = find(parent[x]); }

    bool unite(int a, int b) {
        a = find(a);
        b = find(b);
        if (a == b) return false;   // both cities already connected: edge is redundant
        if (rnk[a] < rnk[b]) swap(a, b);
        parent[b] = a;
        if (rnk[a] == rnk[b]) ++rnk[a];
        return true;
    }
};

// connections[i] = {city1, city2, cost} with cities labelled 1..n. Returns the
// minimum total cost to connect all cities, or -1 if that is impossible.
// This is literally Kruskal's MST: "connect everything as cheaply as possible".
long long minimumCostConnectCities(int n, vector<array<int, 3>> connections) {
    sort(connections.begin(), connections.end(),
         [](const array<int, 3>& a, const array<int, 3>& b) { return a[2] < b[2]; });

    Dsu dsu(n + 1);   // +1 because the labels are 1-based
    long long total = 0;
    int used = 0;

    for (const auto& e : connections) {
        // Cheapest-first plus the DSU cycle test is the cut property: the lightest
        // edge crossing between two components is always in some MST.
        if (dsu.unite(e[0], e[1])) {
            total += e[2];
            // A spanning tree on n cities needs exactly n-1 edges; anything after
            // that would close a cycle.
            if (++used == n - 1) return total;
        }
    }
    return -1;   // ran out of edges with fewer than n-1 accepted => disconnected
}`

const TOTAL_ST_CPP = `#include <bits/stdc++.h>
using namespace std;

// Determinant by Gaussian elimination with partial pivoting.
double determinant(vector<vector<double>> a) {
    int n = (int)a.size();
    double det = 1.0;

    for (int col = 0; col < n; ++col) {
        // Pivot on the largest magnitude entry: without it, a small pivot blows up
        // the rounding error and the rounded count comes out wrong.
        int pivot = col;
        for (int r = col + 1; r < n; ++r) {
            if (fabs(a[r][col]) > fabs(a[pivot][col])) pivot = r;
        }
        if (fabs(a[pivot][col]) < 1e-12) return 0.0;   // singular => graph is disconnected

        if (pivot != col) {
            swap(a[col], a[pivot]);
            det = -det;   // a row swap flips the sign of the determinant
        }
        det *= a[col][col];

        for (int r = col + 1; r < n; ++r) {
            double factor = a[r][col] / a[col][col];
            for (int c = col; c < n; ++c) a[r][c] -= factor * a[col][c];
        }
    }
    return det;
}

// Kirchhoff's matrix-tree theorem: the number of spanning trees equals ANY
// cofactor of the Laplacian (degree matrix minus adjacency matrix). All cofactors
// are equal, so simply deleting row 0 and column 0 is enough.
long long countSpanningTrees(const vector<vector<int>>& laplacian) {
    int n = (int)laplacian.size();
    if (n <= 1) return 1;

    vector<vector<double>> minor(n - 1, vector<double>(n - 1));
    for (int i = 1; i < n; ++i) {
        for (int j = 1; j < n; ++j) minor[i - 1][j - 1] = laplacian[i][j];
    }
    // The true value is an integer, so rounding repairs the floating-point drift.
    return llround(fabs(determinant(minor)));
}

vector<vector<int>> buildLaplacian(int V, const vector<pair<int, int>>& edges) {
    vector<vector<int>> lap(V, vector<int>(V, 0));
    for (const auto& e : edges) {
        ++lap[e.first][e.first];   // degree on the diagonal
        ++lap[e.second][e.second];
        --lap[e.first][e.second];  // minus adjacency off the diagonal
        --lap[e.second][e.first];
    }
    return lap;
}

// Cayley's formula is the special case of a complete graph: V^(V-2).
long long spanningTreesOfCompleteGraph(int V) {
    if (V <= 2) return 1;
    long long result = 1;
    for (int i = 0; i < V - 2; ++i) result *= V;
    return result;
}`

const MIN_PROD_ST_CPP = `#include <bits/stdc++.h>
using namespace std;

struct Dsu {
    vector<int> parent;
    explicit Dsu(int n) : parent(n) { iota(parent.begin(), parent.end(), 0); }
    int find(int x) { return parent[x] == x ? x : parent[x] = find(parent[x]); }
    bool unite(int a, int b) {
        a = find(a);
        b = find(b);
        if (a == b) return false;
        parent[a] = b;
        return true;
    }
};

// Minimise the PRODUCT of the chosen edge weights (all weights > 0).
//
// log is monotone and log(w1*w2*...) = log w1 + log w2 + ..., so minimising the
// product is exactly minimising the sum of logs. Ordinary MST therefore solves
// it, and since log preserves order, sorting by log w is the same as sorting by
// w — the transform matters for the objective, not for the comparator.
double minimumProductSpanningTree(int V, vector<array<int, 3>> edges) {
    sort(edges.begin(), edges.end(),
         [](const array<int, 3>& a, const array<int, 3>& b) { return a[2] < b[2]; });

    Dsu dsu(V);
    double logSum = 0.0;
    int used = 0;
    for (const auto& e : edges) {
        if (dsu.unite(e[0], e[1])) {
            logSum += log((double)e[2]);
            if (++used == V - 1) return exp(logSum);
        }
    }
    return -1.0;   // disconnected
}

// Keep the answer exact (and overflow-aware) by returning the edges themselves
// rather than the reconstructed product.
vector<array<int, 3>> minimumProductSpanningTreeEdges(int V, vector<array<int, 3>> edges) {
    sort(edges.begin(), edges.end(),
         [](const array<int, 3>& a, const array<int, 3>& b) { return a[2] < b[2]; });
    Dsu dsu(V);
    vector<array<int, 3>> chosen;
    for (const auto& e : edges) {
        if (dsu.unite(e[0], e[1])) chosen.push_back(e);
    }
    if ((int)chosen.size() != V - 1) return {};
    return chosen;
}`

const REV_DEL_CPP = `#include <bits/stdc++.h>
using namespace std;

// Is the graph still connected using only the edges NOT marked removed?
bool stillConnected(int V, const vector<array<int, 3>>& edges, const vector<char>& removed) {
    vector<vector<int>> adj(V);
    for (int i = 0; i < (int)edges.size(); ++i) {
        if (removed[i]) continue;
        adj[edges[i][0]].push_back(edges[i][1]);
        adj[edges[i][1]].push_back(edges[i][0]);
    }

    vector<char> seen(V, 0);
    queue<int> q;
    q.push(0);
    seen[0] = 1;
    int reached = 1;
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        for (int v : adj[u]) {
            if (!seen[v]) {
                seen[v] = 1;
                ++reached;
                q.push(v);
            }
        }
    }
    return reached == V;
}

// Reverse-delete MST: start from the whole graph and greedily throw away the
// HEAVIEST edge whose removal keeps the graph connected. This is Kruskal run
// backwards and it relies on the cycle property: the heaviest edge of any cycle
// is never needed by an MST.
long long reverseDeleteMst(int V, vector<array<int, 3>> edges) {
    vector<int> order(edges.size());
    iota(order.begin(), order.end(), 0);
    // Heaviest first: deleting cheap edges early would strand heavy ones as the
    // only remaining connection and inflate the total.
    sort(order.begin(), order.end(),
         [&](int a, int b) { return edges[a][2] > edges[b][2]; });

    vector<char> removed(edges.size(), 0);
    long long total = 0;
    for (const auto& e : edges) total += e[2];

    for (int idx : order) {
        removed[idx] = 1;
        if (stillConnected(V, edges, removed)) {
            total -= edges[idx][2];   // edge was on a cycle, so it is safe to drop
        } else {
            removed[idx] = 0;         // removal disconnected the graph => it is a bridge
        }
    }
    return total;
}`

const BORUVKA_CPP = `#include <bits/stdc++.h>
using namespace std;

int dsuFind(vector<int>& parent, int x) {
    return parent[x] == x ? x : parent[x] = dsuFind(parent, parent[x]);
}

// Boruvka: every round, EVERY component simultaneously picks its own cheapest
// outgoing edge and merges along it. Each round at least halves the component
// count, so there are at most log V rounds of O(E) work.
long long boruvkaMst(int V, const vector<array<int, 3>>& edges) {
    vector<int> parent(V);
    iota(parent.begin(), parent.end(), 0);

    int components = V;
    long long cost = 0;

    while (components > 1) {
        // cheapest[c] = index of the lightest edge leaving component c.
        vector<int> cheapest(V, -1);
        for (int i = 0; i < (int)edges.size(); ++i) {
            int a = dsuFind(parent, edges[i][0]);
            int b = dsuFind(parent, edges[i][1]);
            if (a == b) continue;   // internal edge, does not leave the component
            if (cheapest[a] == -1 || edges[cheapest[a]][2] > edges[i][2]) cheapest[a] = i;
            if (cheapest[b] == -1 || edges[cheapest[b]][2] > edges[i][2]) cheapest[b] = i;
        }

        bool merged = false;
        for (int c = 0; c < V; ++c) {
            if (cheapest[c] == -1) continue;
            int a = dsuFind(parent, edges[cheapest[c]][0]);
            int b = dsuFind(parent, edges[cheapest[c]][1]);
            // Two components can nominate the SAME edge, so re-check after the
            // earlier merges in this round; otherwise the weight is double counted.
            if (a == b) continue;
            parent[a] = b;
            cost += edges[cheapest[c]][2];
            --components;
            merged = true;
        }

        // No component found an outgoing edge => the graph is disconnected and no
        // spanning tree exists. Without this guard the loop never terminates.
        if (!merged) return -1;
    }
    return cost;
}`

/* ------------------------------------------------------------------ */
/* Strong connectivity                                                 */
/* ------------------------------------------------------------------ */

const SCC_CPP = `#include <bits/stdc++.h>
using namespace std;

// Strongly connected component = maximal vertex set in which every pair is
// mutually reachable. Contracting each SCC always yields a DAG.
//
// Tarjan finds them all in ONE DFS using low-link values.
struct TarjanScc {
    int timer = 0;
    vector<int> disc, low, stk;
    vector<char> onStack;
    vector<vector<int>> components;

    vector<vector<int>> findComponents(const vector<vector<int>>& adj) {
        int n = (int)adj.size();
        disc.assign(n, -1);
        low.assign(n, 0);
        onStack.assign(n, 0);
        stk.clear();
        components.clear();
        timer = 0;

        for (int u = 0; u < n; ++u) {
            if (disc[u] == -1) dfs(u, adj);
        }
        // Components come out in REVERSE topological order of the condensation.
        return components;
    }

    void dfs(int u, const vector<vector<int>>& adj) {
        // disc = discovery time; low = smallest disc reachable from u's subtree
        // using tree edges plus at most one edge back into the current stack.
        disc[u] = low[u] = timer++;
        stk.push_back(u);
        onStack[u] = 1;

        for (int v : adj[u]) {
            if (disc[v] == -1) {
                dfs(v, adj);
                low[u] = min(low[u], low[v]);      // tree edge: inherit the child's reach
            } else if (onStack[v]) {
                low[u] = min(low[u], disc[v]);     // back edge inside the current SCC
                // disc[v], not low[v]: low[v] may already point into a different
                // subtree, which would merge two genuinely separate components.
            }
            // Visited but off the stack => v belongs to an already-closed SCC and
            // cannot reach u, so it must be ignored entirely.
        }

        // Nothing in u's subtree reaches above u, so u is the ROOT of an SCC and
        // everything sitting above u on the stack is exactly that component.
        if (low[u] == disc[u]) {
            vector<int> component;
            while (true) {
                int v = stk.back();
                stk.pop_back();
                onStack[v] = 0;
                component.push_back(v);
                if (v == u) break;
            }
            components.push_back(component);
        }
    }
};

// Kosaraju: the same partition in two passes, easier to remember. Reverse finish
// order picks a SOURCE component of the transpose, so the second DFS cannot leak.
vector<vector<int>> kosarajuComponents(const vector<vector<int>>& adj) {
    int n = (int)adj.size();
    vector<char> seen(n, 0);
    vector<int> finishOrder;
    finishOrder.reserve(n);

    function<void(int)> orderDfs = [&](int u) {
        seen[u] = 1;
        for (int v : adj[u]) {
            if (!seen[v]) orderDfs(v);
        }
        finishOrder.push_back(u);   // appended on FINISH, so the last one finished last
    };
    for (int u = 0; u < n; ++u) {
        if (!seen[u]) orderDfs(u);
    }

    vector<vector<int>> rev(n);
    for (int u = 0; u < n; ++u) {
        for (int v : adj[u]) rev[v].push_back(u);
    }

    fill(seen.begin(), seen.end(), 0);
    vector<vector<int>> components;
    for (int i = n - 1; i >= 0; --i) {
        int s = finishOrder[i];
        if (seen[s]) continue;
        vector<int> component;
        function<void(int)> collect = [&](int u) {
            seen[u] = 1;
            component.push_back(u);
            for (int v : rev[u]) {
                if (!seen[v]) collect(v);
            }
        };
        collect(s);
        components.push_back(component);
    }
    return components;
}`

const CONDENSE_CPP = `#include <bits/stdc++.h>
using namespace std;

// Given comp[v] = SCC id of v, build the condensation: one vertex per SCC with
// an edge whenever some original edge crosses between two different SCCs.
// The result is ALWAYS a DAG, which is the whole point: cycle-free means DP,
// topological order and longest-path all become available.
vector<vector<int>> buildCondensation(const vector<vector<int>>& adj, const vector<int>& comp) {
    int componentCount = 0;
    for (int c : comp) componentCount = max(componentCount, c + 1);

    vector<vector<int>> dag(componentCount);
    // Deduplicate: many original edges can map onto the same condensed edge, and
    // parallel edges would break later per-edge DP.
    set<pair<int, int>> seen;
    for (int u = 0; u < (int)adj.size(); ++u) {
        for (int v : adj[u]) {
            // Intra-component edges become self loops; dropping them is what keeps
            // the condensation acyclic.
            if (comp[u] == comp[v]) continue;
            if (seen.insert({comp[u], comp[v]}).second) dag[comp[u]].push_back(comp[v]);
        }
    }
    return dag;
}

// Typical payoff: the longest chain of SCCs, computed by plain DAG DP.
int longestChainInCondensation(const vector<vector<int>>& dag) {
    int n = (int)dag.size();
    vector<int> indeg(n, 0);
    for (int u = 0; u < n; ++u) {
        for (int v : dag[u]) ++indeg[v];
    }
    queue<int> q;
    for (int u = 0; u < n; ++u) {
        if (indeg[u] == 0) q.push(u);
    }
    vector<int> dp(n, 1);
    int best = 0;
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        best = max(best, dp[u]);
        for (int v : dag[u]) {
            dp[v] = max(dp[v], dp[u] + 1);
            if (--indeg[v] == 0) q.push(v);
        }
    }
    return best;
}

// Sizes per component: an SCC of size > 1 (or with a self loop) is exactly a
// vertex set from which the graph can never escape once entered.
vector<int> componentSizes(const vector<int>& comp) {
    int componentCount = 0;
    for (int c : comp) componentCount = max(componentCount, c + 1);
    vector<int> sizes(componentCount, 0);
    for (int c : comp) ++sizes[c];
    return sizes;
}`

const WALKS_K_CPP = `#include <bits/stdc++.h>
using namespace std;

// A[i][j] counts walks of length 1. Multiplying two such matrices sums over the
// shared middle vertex, so A^k counts walks of EXACTLY k edges. Walks, not paths:
// vertices may repeat.
vector<vector<long long>> multiply(const vector<vector<long long>>& a,
                                   const vector<vector<long long>>& b, long long mod) {
    int n = (int)a.size();
    vector<vector<long long>> c(n, vector<long long>(n, 0));
    for (int i = 0; i < n; ++i) {
        for (int k = 0; k < n; ++k) {
            // Skipping zeros is a large win on sparse adjacency matrices, and the
            // i-k-j loop order keeps the inner access pattern contiguous.
            if (a[i][k] == 0) continue;
            for (int j = 0; j < n; ++j) {
                c[i][j] = (c[i][j] + a[i][k] * b[k][j]) % mod;
            }
        }
    }
    return c;
}

// Number of walks with exactly k edges between every pair, in O(V^3 log k).
vector<vector<long long>> countWalksWithKEdges(vector<vector<long long>> adjacency, long long k,
                                               long long mod = 1000000007LL) {
    int n = (int)adjacency.size();
    // Identity = A^0: exactly one walk of length 0 from a vertex to itself.
    vector<vector<long long>> result(n, vector<long long>(n, 0));
    for (int i = 0; i < n; ++i) result[i][i] = 1;

    // Binary exponentiation: k is consumed bit by bit, so only log k multiplies
    // happen instead of k of them.
    while (k > 0) {
        if (k & 1) result = multiply(result, adjacency, mod);
        adjacency = multiply(adjacency, adjacency, mod);
        k >>= 1;
    }
    return result;
}

// Walks of length AT MOST k: add a self loop at every vertex so "staying put"
// becomes a legal step, then ask for exactly k.
vector<vector<long long>> countWalksAtMostKEdges(vector<vector<long long>> adjacency, long long k,
                                                 long long mod = 1000000007LL) {
    for (int i = 0; i < (int)adjacency.size(); ++i) adjacency[i][i] += 1;
    return countWalksWithKEdges(adjacency, k, mod);
}`

const STRING_CHAIN_CPP = `#include <bits/stdc++.h>
using namespace std;

void reachDfs(int u, const vector<vector<int>>& adj, vector<char>& seen) {
    seen[u] = 1;
    for (int v : adj[u]) {
        if (!seen[v]) reachDfs(v, adj, seen);
    }
}

// Can the words be arranged in a circle so each word's last letter equals the
// next word's first letter?
//
// Model each LETTER as a vertex and each WORD as a directed edge first -> last.
// A circular arrangement using every word once is exactly an Euler CIRCUIT.
bool canFormCircle(const vector<string>& words) {
    vector<vector<int>> adj(26), rev(26);
    vector<int> indeg(26, 0), outdeg(26, 0);
    vector<char> used(26, 0);

    for (const string& w : words) {
        int a = w.front() - 'a', b = w.back() - 'a';
        adj[a].push_back(b);
        rev[b].push_back(a);
        ++outdeg[a];
        ++indeg[b];
        used[a] = used[b] = 1;
    }

    // Euler circuit condition 1: in-degree equals out-degree at every vertex,
    // because entering a letter and leaving it must always come in pairs.
    for (int i = 0; i < 26; ++i) {
        if (used[i] && indeg[i] != outdeg[i]) return false;
    }

    int start = -1;
    for (int i = 0; i < 26; ++i) {
        if (used[i] && outdeg[i] > 0) {
            start = i;
            break;
        }
    }
    if (start == -1) return true;   // no words with edges at all

    // Euler circuit condition 2: all edges lie in ONE strongly connected piece.
    // Degree balance alone is not enough — two disjoint balanced cycles satisfy it
    // but cannot be walked as a single circle.
    vector<char> forward(26, 0), backward(26, 0);
    reachDfs(start, adj, forward);
    reachDfs(start, rev, backward);
    for (int i = 0; i < 26; ++i) {
        if (!used[i]) continue;
        if (indeg[i] + outdeg[i] == 0) continue;
        if (!forward[i] || !backward[i]) return false;
    }
    return true;
}`

/* ------------------------------------------------------------------ */
/* Bridges, cut vertices, biconnectivity                               */
/* ------------------------------------------------------------------ */

const BRIDGES_CPP = `#include <bits/stdc++.h>
using namespace std;

// A bridge (critical connection) is an edge whose removal disconnects its
// component. Only DFS-TREE edges can be bridges: a back edge always has the tree
// path as an alternative route.
struct BridgeFinder {
    int timer = 0;
    vector<int> disc, low;
    vector<pair<int, int>> bridges;

    vector<pair<int, int>> find(const vector<vector<int>>& adj) {
        int n = (int)adj.size();
        disc.assign(n, -1);
        low.assign(n, 0);
        bridges.clear();
        timer = 0;
        // Every component needs its own DFS; a bridge can live anywhere.
        for (int u = 0; u < n; ++u) {
            if (disc[u] == -1) dfs(u, -1, adj);
        }
        return bridges;
    }

    void dfs(int u, int parent, const vector<vector<int>>& adj) {
        disc[u] = low[u] = timer++;
        for (int v : adj[u]) {
            // The reverse copy of the edge we entered on is not a back edge.
            if (v == parent) continue;

            if (disc[v] == -1) {
                dfs(v, u, adj);
                low[u] = min(low[u], low[v]);   // absorb everything the subtree can reach

                // STRICT >: v's subtree cannot reach u or any ancestor of u, so
                // (u, v) is the only link and removing it splits the graph.
                // Equality would mean some back edge reaches u itself, giving a
                // detour — that is the articulation-point condition, not this one.
                if (low[v] > disc[u]) bridges.push_back({u, v});
            } else {
                // Back edge: use disc[v] (its own discovery time), never low[v].
                low[u] = min(low[u], disc[v]);
            }
        }
    }
};

// Multigraph-safe variant: adj[u] holds {v, edgeId} with the same id on both
// directions. Skipping the incoming EDGE instead of the parent VERTEX keeps a
// parallel u-v edge usable as a genuine detour (so neither copy is a bridge).
struct BridgeFinderWithIds {
    int timer = 0;
    vector<int> disc, low;
    vector<pair<int, int>> bridges;

    vector<pair<int, int>> find(int n, const vector<vector<pair<int, int>>>& adj) {
        disc.assign(n, -1);
        low.assign(n, 0);
        bridges.clear();
        timer = 0;
        for (int u = 0; u < n; ++u) {
            if (disc[u] == -1) dfs(u, -1, adj);
        }
        return bridges;
    }

    void dfs(int u, int inEdgeId, const vector<vector<pair<int, int>>>& adj) {
        disc[u] = low[u] = timer++;
        for (auto& [v, id] : adj[u]) {
            if (id == inEdgeId) continue;
            if (disc[v] == -1) {
                dfs(v, id, adj);
                low[u] = min(low[u], low[v]);
                if (low[v] > disc[u]) bridges.push_back({u, v});
            } else {
                low[u] = min(low[u], disc[v]);
            }
        }
    }
};`

const ARTICULATION_CPP = `#include <bits/stdc++.h>
using namespace std;

// Articulation point (cut vertex) = a vertex whose removal increases the number
// of connected components.
struct ArticulationPointFinder {
    int timer = 0;
    vector<int> disc, low;
    vector<char> isCut;

    vector<int> find(const vector<vector<int>>& adj) {
        int n = (int)adj.size();
        disc.assign(n, -1);
        low.assign(n, 0);
        isCut.assign(n, 0);
        timer = 0;

        for (int u = 0; u < n; ++u) {
            if (disc[u] == -1) dfs(u, -1, adj);
        }
        vector<int> result;
        for (int u = 0; u < n; ++u) {
            if (isCut[u]) result.push_back(u);
        }
        return result;
    }

    void dfs(int u, int parent, const vector<vector<int>>& adj) {
        disc[u] = low[u] = timer++;
        int children = 0;   // DFS-TREE children only, needed for the root rule

        for (int v : adj[u]) {
            if (v == parent) continue;   // do not mistake the incoming edge for a back edge

            if (disc[v] == -1) {
                ++children;
                dfs(v, u, adj);
                low[u] = min(low[u], low[v]);

                // >= here, not > as for bridges: low[v] == disc[u] means v's subtree
                // can climb back to u but no further, so deleting u still detaches
                // it. u itself counts as the blocking vertex.
                if (parent != -1 && low[v] >= disc[u]) isCut[u] = 1;
            } else {
                low[u] = min(low[u], disc[v]);
            }
        }

        // The root has no parent to fall back on, so the subtree rule cannot apply
        // to it. It is a cut vertex exactly when it stitches together two or more
        // otherwise independent subtrees.
        if (parent == -1 && children > 1) isCut[u] = 1;
    }
};`

const BCC_CPP = `#include <bits/stdc++.h>
using namespace std;

// Biconnected component = maximal set of EDGES with no articulation point
// inside, i.e. any two of its edges lie on a common simple cycle. Components
// partition the edges (not the vertices — cut vertices are shared).
struct BiconnectedComponents {
    int timer = 0;
    vector<int> disc, low;
    vector<pair<int, int>> edgeStack;
    vector<vector<pair<int, int>>> components;

    vector<vector<pair<int, int>>> find(const vector<vector<int>>& adj) {
        int n = (int)adj.size();
        disc.assign(n, -1);
        low.assign(n, 0);
        edgeStack.clear();
        components.clear();
        timer = 0;

        for (int u = 0; u < n; ++u) {
            if (disc[u] == -1) {
                dfs(u, -1, adj);
                // Whatever is left after the root finishes is the last component of
                // that DFS tree; it never triggers the pop condition below.
                if (!edgeStack.empty()) {
                    components.push_back(edgeStack);
                    edgeStack.clear();
                }
            }
        }
        return components;
    }

    void dfs(int u, int parent, const vector<vector<int>>& adj) {
        disc[u] = low[u] = timer++;
        int children = 0;

        for (int v : adj[u]) {
            if (v == parent) continue;

            if (disc[v] == -1) {
                // Push the tree edge BEFORE recursing, so the whole subtree's edges
                // end up above it on the stack and can be popped as one block.
                edgeStack.push_back({u, v});
                ++children;
                dfs(v, u, adj);
                low[u] = min(low[u], low[v]);

                // u separates v's subtree from the rest exactly when u is an
                // articulation point for v, so the edges above (u, v) form one
                // complete biconnected component.
                if ((parent == -1 && children > 1) || (parent != -1 && low[v] >= disc[u])) {
                    vector<pair<int, int>> component;
                    while (true) {
                        pair<int, int> e = edgeStack.back();
                        edgeStack.pop_back();
                        component.push_back(e);
                        if ((e.first == u && e.second == v) || (e.first == v && e.second == u)) break;
                    }
                    components.push_back(component);
                }
            } else if (disc[v] < disc[u]) {
                // Only push a back edge that goes UPWARD. Without this test each
                // undirected edge would be pushed twice, duplicating it inside the
                // reported component.
                edgeStack.push_back({u, v});
                low[u] = min(low[u], disc[v]);
            }
        }
    }
};`

/* ------------------------------------------------------------------ */
/* Flows, cuts and matchings                                           */
/* ------------------------------------------------------------------ */

const MAX_FLOW_CPP = `#include <bits/stdc++.h>
using namespace std;

// Max flow via Edmonds-Karp: Ford-Fulkerson where the augmenting path is always
// a SHORTEST one (BFS). cap[u][v] is left untouched; a residual copy is used.
long long maxFlowEdmondsKarp(const vector<vector<int>>& cap, int s, int t) {
    int n = (int)cap.size();
    vector<vector<int>> residual = cap;
    vector<int> parent(n);
    long long flow = 0;

    while (true) {
        fill(parent.begin(), parent.end(), -1);
        parent[s] = s;   // marks the source visited without giving it a predecessor
        queue<int> q;
        q.push(s);

        // BFS, not DFS. Picking the fewest-edge augmenting path bounds the number
        // of augmentations by O(V*E), independently of how large the capacities
        // are — plain DFS can take one unit of flow per iteration.
        while (!q.empty() && parent[t] == -1) {
            int u = q.front();
            q.pop();
            for (int v = 0; v < n; ++v) {
                if (parent[v] == -1 && residual[u][v] > 0) {
                    parent[v] = u;
                    q.push(v);
                }
            }
        }

        // No s-t path left in the residual graph. By max-flow min-cut that is
        // precisely the optimality certificate, so we are done.
        if (parent[t] == -1) break;

        int bottleneck = INT_MAX;
        for (int v = t; v != s; v = parent[v]) {
            bottleneck = min(bottleneck, residual[parent[v]][v]);
        }

        for (int v = t; v != s; v = parent[v]) {
            residual[parent[v]][v] -= bottleneck;   // consume forward capacity
            // The REVERSE arc is the essential part: it lets a later augmenting
            // path cancel this decision, which is why a greedy path choice can
            // never trap the algorithm in a suboptimal flow.
            residual[v][parent[v]] += bottleneck;
        }
        flow += bottleneck;
    }
    return flow;
}

// Ford-Fulkerson with a DFS search: same correctness, but the iteration count
// depends on the capacity VALUES, so it can be exponential on adversarial input.
bool residualDfs(vector<vector<int>>& residual, int u, int t,
                 vector<int>& parent, vector<char>& seen) {
    if (u == t) return true;
    seen[u] = 1;
    for (int v = 0; v < (int)residual.size(); ++v) {
        if (!seen[v] && residual[u][v] > 0) {
            parent[v] = u;
            if (residualDfs(residual, v, t, parent, seen)) return true;
        }
    }
    return false;
}

long long maxFlowFordFulkerson(const vector<vector<int>>& cap, int s, int t) {
    int n = (int)cap.size();
    vector<vector<int>> residual = cap;
    vector<int> parent(n, -1);
    long long flow = 0;

    vector<char> seen(n, 0);
    while (fill(seen.begin(), seen.end(), 0), residualDfs(residual, s, t, parent, seen)) {
        int bottleneck = INT_MAX;
        for (int v = t; v != s; v = parent[v]) bottleneck = min(bottleneck, residual[parent[v]][v]);
        for (int v = t; v != s; v = parent[v]) {
            residual[parent[v]][v] -= bottleneck;
            residual[v][parent[v]] += bottleneck;
        }
        flow += bottleneck;
    }
    return flow;
}`

const DINIC_CPP = `#include <bits/stdc++.h>
using namespace std;

// Dinic: O(V^2 * E) in general and O(E * sqrt(V)) on unit-capacity graphs, which
// makes it the default choice over Edmonds-Karp.
struct Dinic {
    struct FlowEdge {
        int to;
        int rev;    // index of the paired reverse edge inside graph[to]
        long long cap;
    };

    vector<vector<FlowEdge>> graph;
    vector<int> level, iter;

    explicit Dinic(int n) : graph(n), level(n), iter(n) {}

    void addEdge(int u, int v, long long capacity) {
        // Store both arcs and cross-link them. The reverse arc starts at capacity
        // 0 for a directed edge; pushing flow forward raises it, which is exactly
        // how the algorithm is able to undo an earlier decision.
        graph[u].push_back({v, (int)graph[v].size(), capacity});
        graph[v].push_back({u, (int)graph[u].size() - 1, 0});
    }

    // Level graph: BFS distance from s in the residual graph.
    bool buildLevels(int s, int t) {
        fill(level.begin(), level.end(), -1);
        queue<int> q;
        level[s] = 0;
        q.push(s);
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            for (const FlowEdge& e : graph[u]) {
                if (e.cap > 0 && level[e.to] < 0) {
                    level[e.to] = level[u] + 1;
                    q.push(e.to);
                }
            }
        }
        return level[t] >= 0;   // t unreachable => residual graph is saturated => done
    }

    // Push flow only along edges that go from level L to level L+1, so every
    // augmenting path in this phase has exactly the BFS distance as its length.
    long long sendFlow(int u, int t, long long limit) {
        if (u == t) return limit;

        // iter[u] is the "current arc" pointer. It is never reset inside a phase,
        // so an edge that already proved useless is not rescanned; that is what
        // keeps one blocking-flow phase at O(V*E).
        for (int& i = iter[u]; i < (int)graph[u].size(); ++i) {
            FlowEdge& e = graph[u][i];
            if (e.cap <= 0 || level[e.to] != level[u] + 1) continue;

            long long pushed = sendFlow(e.to, t, min(limit, e.cap));
            if (pushed > 0) {
                e.cap -= pushed;
                graph[e.to][e.rev].cap += pushed;   // grow the residual reverse arc
                return pushed;
            }
        }
        return 0;
    }

    long long maxFlow(int s, int t) {
        long long flow = 0;
        // Each phase strictly increases the s-t distance in the level graph, so at
        // most V phases can happen.
        while (buildLevels(s, t)) {
            fill(iter.begin(), iter.end(), 0);
            long long pushed;
            while ((pushed = sendFlow(s, t, LLONG_MAX)) > 0) flow += pushed;
        }
        return flow;
    }

    // After maxFlow, level[] from the last (failed) BFS is the s-side of a
    // minimum cut.
    vector<char> minCutSide(int s, int t) {
        buildLevels(s, t);
        vector<char> side(graph.size(), 0);
        for (int v = 0; v < (int)graph.size(); ++v) side[v] = level[v] >= 0 ? 1 : 0;
        return side;
    }
};`

const BIP_FLOW_CPP = `#include <bits/stdc++.h>
using namespace std;

struct Dinic {
    struct FlowEdge {
        int to, rev;
        int cap;
    };
    vector<vector<FlowEdge>> graph;
    vector<int> level, iter;

    explicit Dinic(int n) : graph(n), level(n), iter(n) {}

    void addEdge(int u, int v, int capacity) {
        graph[u].push_back({v, (int)graph[v].size(), capacity});
        graph[v].push_back({u, (int)graph[u].size() - 1, 0});
    }

    bool buildLevels(int s, int t) {
        fill(level.begin(), level.end(), -1);
        queue<int> q;
        level[s] = 0;
        q.push(s);
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            for (const FlowEdge& e : graph[u]) {
                if (e.cap > 0 && level[e.to] < 0) {
                    level[e.to] = level[u] + 1;
                    q.push(e.to);
                }
            }
        }
        return level[t] >= 0;
    }

    int sendFlow(int u, int t, int limit) {
        if (u == t) return limit;
        for (int& i = iter[u]; i < (int)graph[u].size(); ++i) {
            FlowEdge& e = graph[u][i];
            if (e.cap <= 0 || level[e.to] != level[u] + 1) continue;
            int pushed = sendFlow(e.to, t, min(limit, e.cap));
            if (pushed > 0) {
                e.cap -= pushed;
                graph[e.to][e.rev].cap += pushed;   // residual arc enables backtracking
                return pushed;
            }
        }
        return 0;
    }

    int maxFlow(int s, int t) {
        int flow = 0;
        while (buildLevels(s, t)) {
            fill(iter.begin(), iter.end(), 0);
            int pushed;
            while ((pushed = sendFlow(s, t, INT_MAX)) > 0) flow += pushed;
        }
        return flow;
    }
};

// Maximum bipartite matching as a unit-capacity flow problem.
// Layout: super source 0, left 1..L, right L+1..L+R, super sink L+R+1.
// edges hold 1-based {leftVertex, rightVertex} pairs.
int maxBipartiteMatching(int L, int R, const vector<pair<int, int>>& edges) {
    int source = 0, sink = L + R + 1;
    Dinic dinic(sink + 1);

    // Capacity 1 on the source and sink arcs is what enforces the matching rule:
    // each left vertex can ship at most one unit, each right vertex can absorb at
    // most one, so an integral max flow IS a maximum matching.
    for (int i = 1; i <= L; ++i) dinic.addEdge(source, i, 1);
    for (int j = 1; j <= R; ++j) dinic.addEdge(L + j, sink, 1);
    for (const auto& e : edges) dinic.addEdge(e.first, L + e.second, 1);

    // On unit-capacity bipartite graphs Dinic runs in O(E * sqrt(V)), i.e. the
    // same bound as Hopcroft-Karp.
    return dinic.maxFlow(source, sink);
}

// Konig's theorem: minimum vertex cover size equals maximum matching size, and
// max independent set = V - matching. Same computation, three answers.
int minimumVertexCoverBipartite(int L, int R, const vector<pair<int, int>>& edges) {
    return maxBipartiteMatching(L, R, edges);
}`

const PUSH_REL_CPP = `#include <bits/stdc++.h>
using namespace std;

// Push-relabel (FIFO variant). Instead of finding whole augmenting paths, it
// moves excess flow LOCALLY and keeps a height function that only allows
// downhill pushes. That local view is why it parallelises well.
long long pushRelabelMaxFlow(const vector<vector<int>>& cap, int s, int t) {
    int n = (int)cap.size();
    vector<vector<long long>> flow(n, vector<long long>(n, 0));
    vector<int> height(n, 0);
    vector<long long> excess(n, 0);

    // Height n at the source: it must dominate every other vertex so the initial
    // saturating push is legal and no flow can ever be pushed back into s.
    height[s] = n;
    for (int v = 0; v < n; ++v) {
        if (v == s) continue;
        flow[s][v] = cap[s][v];
        flow[v][s] = -cap[s][v];   // antisymmetry keeps residual = cap - flow correct
        excess[v] = cap[s][v];
    }

    queue<int> active;
    for (int v = 0; v < n; ++v) {
        if (v != s && v != t && excess[v] > 0) active.push(v);
    }

    while (!active.empty()) {
        int u = active.front();
        active.pop();

        // PUSH: move excess along an edge with residual capacity that goes exactly
        // one level downhill. The strict height[u] == height[v] + 1 rule is what
        // guarantees termination.
        for (int v = 0; v < n && excess[u] > 0; ++v) {
            long long residual = cap[u][v] - flow[u][v];
            if (residual > 0 && height[u] == height[v] + 1) {
                long long delta = min(excess[u], residual);
                flow[u][v] += delta;
                flow[v][u] -= delta;
                excess[u] -= delta;
                excess[v] += delta;
                // excess[v] == delta means it was exactly zero before this push, so v
                // is newly active. Testing it this way enqueues v once per activation
                // instead of once per push.
                if (v != s && v != t && excess[v] == delta) active.push(v);
            }
        }

        // RELABEL: still holding excess with no downhill neighbour, so lift u just
        // above its lowest residual neighbour and try again.
        if (excess[u] > 0) {
            int minHeight = INT_MAX;
            for (int v = 0; v < n; ++v) {
                if (cap[u][v] - flow[u][v] > 0) minHeight = min(minHeight, height[v]);
            }
            if (minHeight == INT_MAX) continue;   // completely blocked: excess returns to s
            height[u] = minHeight + 1;
            active.push(u);
        }
    }

    // Excess trapped at the sink can never leave, so it is the value of the flow.
    return excess[t];
}`

const EDGE_DISJ_CPP = `#include <bits/stdc++.h>
using namespace std;

// Menger's theorem: the maximum number of EDGE-disjoint s-t paths equals the max
// flow when every edge has capacity 1, and equals the minimum number of edges
// whose removal separates s from t.
long long maxFlowUnitCapacity(vector<vector<int>>& residual, int s, int t) {
    int n = (int)residual.size();
    vector<int> parent(n);
    long long paths = 0;

    while (true) {
        fill(parent.begin(), parent.end(), -1);
        parent[s] = s;
        queue<int> q;
        q.push(s);
        while (!q.empty() && parent[t] == -1) {
            int u = q.front();
            q.pop();
            for (int v = 0; v < n; ++v) {
                if (parent[v] == -1 && residual[u][v] > 0) {
                    parent[v] = u;
                    q.push(v);
                }
            }
        }
        if (parent[t] == -1) break;

        // Unit capacities make the bottleneck always 1, so each augmentation adds
        // exactly one more edge-disjoint path.
        for (int v = t; v != s; v = parent[v]) {
            --residual[parent[v]][v];
            // The reverse arc still matters: a later path may need to "un-use" this
            // edge to route around a shared bottleneck.
            ++residual[v][parent[v]];
        }
        ++paths;
    }
    return paths;
}

long long maxEdgeDisjointPaths(int V, const vector<pair<int, int>>& edges, int s, int t) {
    vector<vector<int>> cap(V, vector<int>(V, 0));
    // += so parallel edges each contribute one unit of capacity.
    for (const auto& e : edges) cap[e.first][e.second] += 1;
    return maxFlowUnitCapacity(cap, s, t);
}

// VERTEX-disjoint paths need vertex splitting: replace each internal vertex v by
// v_in -> v_out with capacity 1, which caps how often v may be used.
long long maxVertexDisjointPaths(int V, const vector<pair<int, int>>& edges, int s, int t) {
    int n = 2 * V;
    auto in = [](int v) { return 2 * v; };
    auto out = [](int v) { return 2 * v + 1; };

    vector<vector<int>> cap(n, vector<int>(n, 0));
    for (int v = 0; v < V; ++v) {
        // s and t must stay unlimited, otherwise they would cap the answer at 1.
        cap[in(v)][out(v)] = (v == s || v == t) ? (int)edges.size() + 1 : 1;
    }
    for (const auto& e : edges) cap[out(e.first)][in(e.second)] += 1;
    return maxFlowUnitCapacity(cap, in(s), out(t));
}`

const MIN_CUT_CPP = `#include <bits/stdc++.h>
using namespace std;

// Minimum s-t cut. Max-flow min-cut theorem: the cut VALUE is the max flow, and
// the cut EDGES are the saturated edges leaving the residual-reachable set of s.
vector<pair<int, int>> minimumStCutEdges(const vector<vector<int>>& cap, int s, int t) {
    int n = (int)cap.size();
    vector<vector<int>> residual = cap;

    // Phase 1: run any max-flow algorithm to saturate the graph.
    vector<int> parent(n);
    while (true) {
        fill(parent.begin(), parent.end(), -1);
        parent[s] = s;
        queue<int> q;
        q.push(s);
        while (!q.empty() && parent[t] == -1) {
            int u = q.front();
            q.pop();
            for (int v = 0; v < n; ++v) {
                if (parent[v] == -1 && residual[u][v] > 0) {
                    parent[v] = u;
                    q.push(v);
                }
            }
        }
        if (parent[t] == -1) break;

        int bottleneck = INT_MAX;
        for (int v = t; v != s; v = parent[v]) bottleneck = min(bottleneck, residual[parent[v]][v]);
        for (int v = t; v != s; v = parent[v]) {
            residual[parent[v]][v] -= bottleneck;
            residual[v][parent[v]] += bottleneck;
        }
    }

    // Phase 2: everything still reachable from s in the RESIDUAL graph forms the
    // s-side S of the cut. t is provably not in S, because otherwise another
    // augmenting path would exist.
    vector<char> reachable(n, 0);
    queue<int> q;
    q.push(s);
    reachable[s] = 1;
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        for (int v = 0; v < n; ++v) {
            if (!reachable[v] && residual[u][v] > 0) {
                reachable[v] = 1;
                q.push(v);
            }
        }
    }

    // The cut edges are the ORIGINAL edges from S to its complement. Each is
    // saturated (zero residual), so their capacities sum to exactly the max flow.
    vector<pair<int, int>> cut;
    for (int u = 0; u < n; ++u) {
        if (!reachable[u]) continue;
        for (int v = 0; v < n; ++v) {
            if (!reachable[v] && cap[u][v] > 0) cut.push_back({u, v});
        }
    }
    return cut;
}

long long minimumStCutValue(const vector<vector<int>>& cap, int s, int t) {
    long long total = 0;
    for (const auto& e : minimumStCutEdges(cap, s, t)) total += cap[e.first][e.second];
    return total;
}`

const HK_CPP = `#include <bits/stdc++.h>
using namespace std;

// Hopcroft-Karp: maximum bipartite matching in O(E * sqrt(V)). Instead of one
// augmenting path per round it finds a maximal SET of shortest vertex-disjoint
// augmenting paths, which caps the number of rounds at O(sqrt(V)).
struct HopcroftKarp {
    int nLeft, nRight;
    vector<vector<int>> adj;   // 1-based left vertices
    vector<int> matchLeft, matchRight, dist;

    HopcroftKarp(int nLeft, int nRight)
        : nLeft(nLeft), nRight(nRight), adj(nLeft + 1),
          matchLeft(nLeft + 1, 0), matchRight(nRight + 1, 0), dist(nLeft + 1, 0) {}

    void addEdge(int u, int v) { adj[u].push_back(v); }

    // Layer the free left vertices by BFS distance; returns true when some free
    // right vertex is reachable, i.e. an augmenting path still exists.
    bool buildLayers() {
        queue<int> q;
        for (int u = 1; u <= nLeft; ++u) {
            if (matchLeft[u] == 0) {
                dist[u] = 0;
                q.push(u);       // only UNMATCHED left vertices can start a path
            } else {
                dist[u] = INT_MAX;
            }
        }

        bool foundFree = false;
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            for (int v : adj[u]) {
                int owner = matchRight[v];
                if (owner == 0) {
                    // Reached a free right vertex: at least one augmenting path of
                    // this length exists.
                    foundFree = true;
                } else if (dist[owner] == INT_MAX) {
                    // Alternate: cross the matched edge back to the left side.
                    dist[owner] = dist[u] + 1;
                    q.push(owner);
                }
            }
        }
        return foundFree;
    }

    // DFS restricted to the layer structure, so only SHORTEST augmenting paths
    // are used and the found paths are automatically vertex-disjoint.
    bool tryAugment(int u) {
        for (int v : adj[u]) {
            int owner = matchRight[v];
            if (owner == 0 || (dist[owner] == dist[u] + 1 && tryAugment(owner))) {
                // Flip the path: this edge becomes matched, the old one is freed.
                matchLeft[u] = v;
                matchRight[v] = u;
                return true;
            }
        }
        dist[u] = INT_MAX;   // dead end: never revisit u in this phase
        return false;
    }

    int maxMatching() {
        fill(matchLeft.begin(), matchLeft.end(), 0);
        fill(matchRight.begin(), matchRight.end(), 0);
        int matching = 0;
        while (buildLayers()) {
            for (int u = 1; u <= nLeft; ++u) {
                if (matchLeft[u] == 0 && tryAugment(u)) ++matching;
            }
        }
        return matching;
    }
};`

const CHANNEL_CPP = `#include <bits/stdc++.h>
using namespace std;

// Channel assignment: give adjacent transmitters different frequencies using as
// few channels as possible. That is graph colouring, so the exact optimum is
// NP-hard; the greedy below is the standard practical answer.
vector<int> greedyChannelAssignment(const vector<vector<int>>& adj) {
    int n = (int)adj.size();
    vector<int> channel(n, -1);
    vector<char> used(n + 1, 0);

    for (int u = 0; u < n; ++u) {
        // Collect the channels already taken by u's neighbours.
        for (int v : adj[u]) {
            if (channel[v] >= 0) used[channel[v]] = 1;
        }

        // Smallest free channel. A vertex has at most deg(u) neighbours, so a
        // channel in 0..deg(u) is always available; that is why greedy never needs
        // more than maxDegree + 1 channels overall.
        int c = 0;
        while (c <= n && used[c]) ++c;
        channel[u] = c;

        // Reset only the entries we set, keeping the loop O(deg(u)) instead of O(n).
        for (int v : adj[u]) {
            if (channel[v] >= 0) used[channel[v]] = 0;
        }
    }
    return channel;
}

int channelsNeeded(const vector<vector<int>>& adj) {
    vector<int> channel = greedyChannelAssignment(adj);
    return channel.empty() ? 0 : *max_element(channel.begin(), channel.end()) + 1;
}

// Ordering by decreasing degree (Welsh-Powell) usually needs fewer channels,
// because the hardest-to-place transmitters are handled while choice is widest.
vector<int> welshPowellAssignment(const vector<vector<int>>& adj) {
    int n = (int)adj.size();
    vector<int> order(n);
    iota(order.begin(), order.end(), 0);
    sort(order.begin(), order.end(),
         [&](int a, int b) { return adj[a].size() > adj[b].size(); });

    vector<int> channel(n, -1);
    for (int u : order) {
        set<int> taken;
        for (int v : adj[u]) {
            if (channel[v] >= 0) taken.insert(channel[v]);
        }
        int c = 0;
        while (taken.count(c)) ++c;
        channel[u] = c;
    }
    return channel;
}`

const KARGER_CPP = `#include <bits/stdc++.h>
using namespace std;

int kargerFind(vector<int>& parent, int x) {
    return parent[x] == x ? x : parent[x] = kargerFind(parent, parent[x]);
}

// Karger's randomised GLOBAL min cut (not s-t). One trial contracts random edges
// until two supernodes remain; the surviving crossing edges are a cut.
//
// A specific min cut survives one trial with probability >= 2/(V*(V-1)), so
// running O(V^2 log V) trials makes the failure probability tiny.
int kargerMinCut(int V, const vector<pair<int, int>>& edges, int trials) {
    mt19937 rng(12345);
    int best = INT_MAX;

    for (int trial = 0; trial < trials; ++trial) {
        vector<int> parent(V);
        iota(parent.begin(), parent.end(), 0);
        int supernodes = V;

        while (supernodes > 2) {
            const auto& e = edges[rng() % edges.size()];
            int a = kargerFind(parent, e.first);
            int b = kargerFind(parent, e.second);
            // A self loop inside one supernode carries no information; contracting
            // it would not reduce the count, so just draw again.
            if (a == b) continue;
            parent[a] = b;   // contraction = union of the two endpoints
            --supernodes;
        }

        // Everything still joining the two supernodes is the cut for this trial.
        int cut = 0;
        for (const auto& e : edges) {
            if (kargerFind(parent, e.first) != kargerFind(parent, e.second)) ++cut;
        }
        best = min(best, cut);
    }
    return best;
}

// Karger-Stein: recurse on two half-contracted copies instead of contracting all
// the way down, which raises the success probability to O(1/log V) per call.
int kargerStein(int n, vector<pair<int, int>> edges, mt19937& rng);

int contractTo(int n, vector<pair<int, int>>& edges, int target, mt19937& rng) {
    vector<int> parent(n);
    iota(parent.begin(), parent.end(), 0);
    int supernodes = n;
    while (supernodes > target) {
        const auto& e = edges[rng() % edges.size()];
        int a = kargerFind(parent, e.first);
        int b = kargerFind(parent, e.second);
        if (a == b) continue;
        parent[a] = b;
        --supernodes;
    }
    // Relabel the survivors densely so the recursive call sees 0..target-1.
    vector<int> label(n, -1);
    int next = 0;
    for (int v = 0; v < n; ++v) {
        int r = kargerFind(parent, v);
        if (label[r] == -1) label[r] = next++;
    }
    vector<pair<int, int>> kept;
    for (const auto& e : edges) {
        int a = label[kargerFind(parent, e.first)];
        int b = label[kargerFind(parent, e.second)];
        if (a != b) kept.push_back({a, b});
    }
    edges = kept;
    return next;
}

int kargerStein(int n, vector<pair<int, int>> edges, mt19937& rng) {
    if (n <= 6) {
        int best = INT_MAX;
        for (int trial = 0; trial < 20; ++trial) {
            vector<pair<int, int>> copy = edges;
            int m = contractTo(n, copy, 2, rng);
            (void)m;
            best = min(best, (int)copy.size());
        }
        return best;
    }
    // 1 + n/sqrt(2) is the threshold that keeps the per-level survival probability
    // at least 1/2, which is what the analysis needs.
    int target = 1 + (int)(n / sqrt(2.0));
    vector<pair<int, int>> a = edges, b = edges;
    int na = contractTo(n, a, target, rng);
    int nb = contractTo(n, b, target, rng);
    return min(kargerStein(na, a, rng), kargerStein(nb, b, rng));
}`

/* ------------------------------------------------------------------ */
/* Euler tours                                                         */
/* ------------------------------------------------------------------ */

const EULER_CPP = `#include <bits/stdc++.h>
using namespace std;

// Euler path in an UNDIRECTED graph: a walk that uses every edge exactly once.
// Exists iff the graph is connected on its edges AND has 0 or 2 odd-degree
// vertices (0 => it is a closed circuit, 2 => it must start and end at those two).
//
// adj[u] holds {v, edgeId} with the same id stored on both directions.
vector<int> eulerPathUndirected(int n, const vector<vector<pair<int, int>>>& adj, int edgeCount) {
    int odd = 0, start = -1;
    for (int u = 0; u < n; ++u) {
        if (adj[u].size() % 2 == 1) {
            ++odd;
            start = u;   // an odd vertex MUST be an endpoint, so prefer it as the start
        }
    }
    if (odd != 0 && odd != 2) return {};
    if (start == -1) {
        for (int u = 0; u < n; ++u) {
            if (!adj[u].empty()) {
                start = u;
                break;
            }
        }
    }
    if (start == -1) return {};   // no edges at all

    vector<int> iter(n, 0);            // per-vertex cursor over unused edges
    vector<char> usedEdge(edgeCount, 0);
    vector<int> stk{start}, route;
    route.reserve(edgeCount + 1);

    while (!stk.empty()) {
        int u = stk.back();
        // Advance the cursor past edges consumed from the other endpoint. The
        // cursor never moves backwards, which is what keeps the whole walk linear
        // instead of rescanning spent edges.
        while (iter[u] < (int)adj[u].size() && usedEdge[adj[u][iter[u]].second]) ++iter[u];

        if (iter[u] == (int)adj[u].size()) {
            // Stuck at u: every incident edge is spent, so u's position in the final
            // walk is fixed. Recording it here builds the route back-to-front and
            // automatically splices detours into the right place.
            route.push_back(u);
            stk.pop_back();
        } else {
            auto [v, id] = adj[u][iter[u]];
            usedEdge[id] = 1;   // mark the shared id so BOTH directions are consumed
            stk.push_back(v);
        }
    }

    reverse(route.begin(), route.end());
    // A genuine Euler path visits edgeCount + 1 vertex slots; anything shorter
    // means the edges were split across several components.
    if ((int)route.size() != edgeCount + 1) return {};
    return route;
}

// Existence test only, without building the tour.
bool hasEulerPathUndirected(int n, const vector<vector<int>>& adj) {
    int odd = 0, edges = 0, start = -1;
    for (int u = 0; u < n; ++u) {
        edges += (int)adj[u].size();
        if (adj[u].size() % 2 == 1) ++odd;
        if (!adj[u].empty() && start == -1) start = u;
    }
    if (odd != 0 && odd != 2) return false;
    if (start == -1) return true;

    // Connectivity is the condition people forget: degrees alone are satisfied by
    // two separate even-degree cycles, which cannot be walked as one tour.
    vector<char> seen(n, 0);
    queue<int> q;
    q.push(start);
    seen[start] = 1;
    int reachedEdges = 0;
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        reachedEdges += (int)adj[u].size();
        for (int v : adj[u]) {
            if (!seen[v]) {
                seen[v] = 1;
                q.push(v);
            }
        }
    }
    return reachedEdges == edges;
}`

const EULER_DIR_CPP = `#include <bits/stdc++.h>
using namespace std;

// Euler CIRCUIT in a directed graph: a closed walk using every edge once.
// Exists iff in-degree == out-degree at every vertex and all edges lie in one
// strongly connected piece.
vector<int> eulerCircuitDirected(const vector<vector<int>>& adj) {
    int n = (int)adj.size();
    vector<int> indeg(n, 0), outdeg(n, 0);
    int edgeCount = 0;
    for (int u = 0; u < n; ++u) {
        outdeg[u] = (int)adj[u].size();
        edgeCount += outdeg[u];
        for (int v : adj[u]) ++indeg[v];
    }

    // Balanced degrees: every arrival at a vertex must be paired with a departure,
    // otherwise the walk gets stranded somewhere other than its start.
    for (int u = 0; u < n; ++u) {
        if (indeg[u] != outdeg[u]) return {};
    }

    int start = -1;
    for (int u = 0; u < n; ++u) {
        if (outdeg[u] > 0) {
            start = u;
            break;
        }
    }
    if (start == -1) return {};

    // Hierholzer with a per-vertex cursor: because degrees are balanced, ANY
    // unused edge may be taken. A premature dead end simply becomes a sub-tour
    // that gets spliced in when the stack unwinds back through that vertex.
    vector<int> iter(n, 0), stk{start}, route;
    route.reserve(edgeCount + 1);
    while (!stk.empty()) {
        int u = stk.back();
        if (iter[u] < (int)adj[u].size()) {
            stk.push_back(adj[u][iter[u]++]);   // consume the edge by advancing the cursor
        } else {
            route.push_back(u);                 // no edges left: fix u's place in the walk
            stk.pop_back();
        }
    }

    reverse(route.begin(), route.end());
    // Fewer slots than edges + 1 means the edges spanned several components, so
    // the degree test passed but connectivity did not.
    if ((int)route.size() != edgeCount + 1) return {};
    return route;
}

// Directed Euler PATH (open walk): out-in must be +1 at exactly one vertex (the
// start) and -1 at exactly one (the end), balanced everywhere else.
vector<int> eulerPathDirected(const vector<vector<int>>& adj) {
    int n = (int)adj.size();
    vector<int> indeg(n, 0), outdeg(n, 0);
    int edgeCount = 0;
    for (int u = 0; u < n; ++u) {
        outdeg[u] = (int)adj[u].size();
        edgeCount += outdeg[u];
        for (int v : adj[u]) ++indeg[v];
    }

    int start = -1, plusOne = 0, minusOne = 0;
    for (int u = 0; u < n; ++u) {
        int diff = outdeg[u] - indeg[u];
        if (diff == 1) {
            ++plusOne;
            start = u;
        } else if (diff == -1) {
            ++minusOne;
        } else if (diff != 0) {
            return {};
        }
    }
    if (plusOne > 1 || minusOne > 1) return {};
    if (start == -1) {
        for (int u = 0; u < n; ++u) {
            if (outdeg[u] > 0) {
                start = u;
                break;
            }
        }
    }
    if (start == -1) return {};

    vector<int> iter(n, 0), stk{start}, route;
    while (!stk.empty()) {
        int u = stk.back();
        if (iter[u] < (int)adj[u].size()) stk.push_back(adj[u][iter[u]++]);
        else {
            route.push_back(u);
            stk.pop_back();
        }
    }
    reverse(route.begin(), route.end());
    if ((int)route.size() != edgeCount + 1) return {};
    return route;
}`

const FLEURY_CPP = `#include <bits/stdc++.h>
using namespace std;

// Fleury's rule: never cross a bridge of the REMAINING graph unless it is the
// only edge left. Following it avoids ever cutting off unvisited edges, so the
// walk can be built greedily in one pass with no backtracking.
//
// The bridge test costs O(E) per step, so Fleury is O(E^2) — Hierholzer is the
// linear alternative and is what you should actually ship.
struct Fleury {
    int n;
    vector<vector<pair<int, int>>> adj;   // {neighbour, edgeId}
    vector<char> usedEdge;
    int remaining;

    Fleury(int n, const vector<pair<int, int>>& edges) : n(n), adj(n), remaining((int)edges.size()) {
        usedEdge.assign(edges.size(), 0);
        for (int id = 0; id < (int)edges.size(); ++id) {
            adj[edges[id].first].push_back({edges[id].second, id});
            adj[edges[id].second].push_back({edges[id].first, id});
        }
    }

    // How many vertices are reachable from u using only unused edges.
    int reachableCount(int u) {
        vector<char> seen(n, 0);
        int count = 0;
        vector<int> st{u};
        seen[u] = 1;
        while (!st.empty()) {
            int x = st.back();
            st.pop_back();
            ++count;
            for (auto& [y, id] : adj[x]) {
                if (usedEdge[id] || seen[y]) continue;
                seen[y] = 1;
                st.push_back(y);
            }
        }
        return count;
    }

    // (u, v) with id is a bridge of the remaining graph iff removing it shrinks
    // the set reachable from u.
    bool isBridge(int u, int id) {
        int before = reachableCount(u);
        usedEdge[id] = 1;
        int after = reachableCount(u);
        usedEdge[id] = 0;
        return after < before;
    }

    vector<int> tour() {
        // Start at an odd-degree vertex when one exists, because an Euler path must
        // begin at one; otherwise any vertex with an edge will do.
        int start = -1;
        for (int u = 0; u < n; ++u) {
            if (adj[u].size() % 2 == 1) {
                start = u;
                break;
            }
        }
        if (start == -1) {
            for (int u = 0; u < n; ++u) {
                if (!adj[u].empty()) {
                    start = u;
                    break;
                }
            }
        }
        if (start == -1) return {};

        vector<int> route{start};
        int u = start;
        while (remaining > 0) {
            int chosenEdge = -1, chosenVertex = -1;
            int fallbackEdge = -1, fallbackVertex = -1;

            for (auto& [v, id] : adj[u]) {
                if (usedEdge[id]) continue;
                fallbackEdge = id;
                fallbackVertex = v;
                // Prefer a non-bridge; crossing a bridge early would strand the
                // edges on the far side of it.
                if (!isBridge(u, id)) {
                    chosenEdge = id;
                    chosenVertex = v;
                    break;
                }
            }
            if (chosenEdge == -1) {
                // Only bridges left, so one of them is now unavoidable and safe.
                chosenEdge = fallbackEdge;
                chosenVertex = fallbackVertex;
            }
            if (chosenEdge == -1) break;

            usedEdge[chosenEdge] = 1;
            --remaining;
            u = chosenVertex;
            route.push_back(u);
        }
        return route;
    }
};`

const POSTMAN_CPP = `#include <bits/stdc++.h>
using namespace std;

const int INF = INT_MAX / 4;

// All-pairs shortest paths on the undirected weighted graph.
vector<vector<int>> allPairsShortest(int V, const vector<array<int, 3>>& edges) {
    vector<vector<int>> d(V, vector<int>(V, INF));
    for (int i = 0; i < V; ++i) d[i][i] = 0;
    for (const auto& e : edges) {
        d[e[0]][e[1]] = min(d[e[0]][e[1]], e[2]);
        d[e[1]][e[0]] = min(d[e[1]][e[0]], e[2]);
    }
    for (int k = 0; k < V; ++k) {
        for (int i = 0; i < V; ++i) {
            if (d[i][k] >= INF) continue;
            for (int j = 0; j < V; ++j) {
                if (d[k][j] >= INF) continue;
                d[i][j] = min(d[i][j], d[i][k] + d[k][j]);
            }
        }
    }
    return d;
}

// Minimum-cost perfect matching on the odd-degree vertices, by bitmask DP over
// which odd vertices are already paired.
int minOddPairing(const vector<int>& odd, const vector<vector<int>>& dist) {
    int k = (int)odd.size();
    vector<int> dp(1 << k, INF);
    dp[0] = 0;

    for (int mask = 0; mask < (1 << k); ++mask) {
        if (dp[mask] >= INF) continue;
        // Always pair the LOWEST unpaired vertex. Fixing one endpoint removes the
        // k! orderings of the same matching and cuts the state space to 2^k.
        int i = 0;
        while (i < k && (mask >> i & 1)) ++i;
        if (i == k) continue;
        for (int j = i + 1; j < k; ++j) {
            if (mask >> j & 1) continue;
            int next = mask | (1 << i) | (1 << j);
            dp[next] = min(dp[next], dp[mask] + dist[odd[i]][odd[j]]);
        }
    }
    return dp[(1 << k) - 1];
}

// Chinese postman (route inspection): shortest CLOSED walk using every edge at
// least once.
//
// An Euler circuit exists iff every degree is even, so the extra cost is exactly
// the cheapest way to make all degrees even. Duplicating the edges of a shortest
// path between two odd vertices flips the parity of just those two, so the answer
// is total weight plus the minimum-cost perfect matching on the odd vertices
// (their count is always even, by the handshake lemma).
long long chinesePostmanLength(int V, const vector<array<int, 3>>& edges) {
    vector<int> degree(V, 0);
    long long total = 0;
    for (const auto& e : edges) {
        ++degree[e[0]];
        ++degree[e[1]];
        total += e[2];
    }

    vector<int> odd;
    for (int v = 0; v < V; ++v) {
        if (degree[v] % 2 == 1) odd.push_back(v);
    }
    if (odd.empty()) return total;   // already Eulerian: walk each edge exactly once

    vector<vector<int>> dist = allPairsShortest(V, edges);
    int extra = minOddPairing(odd, dist);
    if (extra >= INF) return -1;     // odd vertices in different components
    return total + extra;
}`

/* ------------------------------------------------------------------ */
/* Colouring and hard tours                                            */
/* ------------------------------------------------------------------ */

const COLOR_CPP = `#include <bits/stdc++.h>
using namespace std;

bool colorIsSafe(int u, int c, const vector<vector<int>>& adj, const vector<int>& color) {
    for (int v : adj[u]) {
        if (color[v] == c) return false;   // a neighbour already owns this colour
    }
    return true;
}

bool colorBacktrack(int u, const vector<vector<int>>& adj, vector<int>& color, int m) {
    // All vertices assigned without a conflict: the colouring is complete.
    if (u == (int)adj.size()) return true;

    for (int c = 1; c <= m; ++c) {
        if (!colorIsSafe(u, c, adj, color)) continue;
        color[u] = c;
        if (colorBacktrack(u + 1, adj, color, m)) return true;
        // Undo before trying the next colour, otherwise a stale assignment leaks
        // into sibling branches and rejects valid colourings.
        color[u] = 0;
    }
    return false;   // no colour works here, so the caller's choice must change
}

// m-colourability. Deciding it is NP-complete, so this is exponential in the
// worst case; the safety check is what prunes most of the tree.
bool isColorableWithM(const vector<vector<int>>& adj, int m) {
    vector<int> color(adj.size(), 0);
    return colorBacktrack(0, adj, color, m);
}

// The actual assignment, or empty when m colours are not enough.
vector<int> colorGraph(const vector<vector<int>>& adj, int m) {
    vector<int> color(adj.size(), 0);
    if (!colorBacktrack(0, adj, color, m)) return {};
    return color;
}

// Chromatic number by trying increasing m. maxDegree + 1 always suffices
// (greedy proves it), so the search is bounded.
int chromaticNumber(const vector<vector<int>>& adj) {
    int n = (int)adj.size();
    if (n == 0) return 0;
    size_t maxDegree = 0;
    for (const auto& row : adj) maxDegree = max(maxDegree, row.size());
    for (int m = 1; m <= (int)maxDegree + 1; ++m) {
        if (isColorableWithM(adj, m)) return m;
    }
    return n;
}

// Greedy colouring: no optimality guarantee, but O(V + E) and never worse than
// maxDegree + 1 colours.
vector<int> greedyColoring(const vector<vector<int>>& adj) {
    int n = (int)adj.size();
    vector<int> color(n, -1);
    vector<char> taken(n + 1, 0);
    for (int u = 0; u < n; ++u) {
        for (int v : adj[u]) {
            if (color[v] >= 0) taken[color[v]] = 1;
        }
        int c = 0;
        while (taken[c]) ++c;
        color[u] = c;
        for (int v : adj[u]) {
            if (color[v] >= 0) taken[color[v]] = 0;
        }
    }
    return color;
}`

const TSP_CPP = `#include <bits/stdc++.h>
using namespace std;

const int INF = INT_MAX / 4;

// Held-Karp: exact TSP in O(2^n * n^2) time and O(2^n * n) memory, which is far
// better than the (n-1)! of brute force but still only practical up to n ~ 20.
//
// dp[mask][u] = cheapest way to start at 0, visit exactly the vertices in mask,
// and currently stand at u. The SET of visited vertices is the state, not the
// order, which is exactly where the factorial saving comes from.
int travelingSalesman(const vector<vector<int>>& dist) {
    int n = (int)dist.size();
    if (n <= 1) return 0;
    int full = 1 << n;

    vector<vector<int>> dp(full, vector<int>(n, INF));
    dp[1][0] = 0;   // mask {0}, standing at the start vertex, nothing spent yet

    for (int mask = 1; mask < full; ++mask) {
        for (int u = 0; u < n; ++u) {
            // u must actually be in mask, and the state must be reachable.
            if (!(mask >> u & 1) || dp[mask][u] >= INF) continue;
            for (int v = 0; v < n; ++v) {
                if (mask >> v & 1) continue;   // no revisits in a Hamiltonian tour
                int next = mask | (1 << v);
                dp[next][v] = min(dp[next][v], dp[mask][u] + dist[u][v]);
            }
        }
    }

    // Close the tour: every vertex visited, then return to 0.
    int best = INF;
    for (int u = 1; u < n; ++u) {
        if (dp[full - 1][u] >= INF) continue;
        best = min(best, dp[full - 1][u] + dist[u][0]);
    }
    return best;
}

// Same DP with parent tracking, so the actual tour can be printed.
vector<int> travelingSalesmanTour(const vector<vector<int>>& dist) {
    int n = (int)dist.size();
    if (n <= 1) return {0};
    int full = 1 << n;

    vector<vector<int>> dp(full, vector<int>(n, INF));
    vector<vector<int>> parent(full, vector<int>(n, -1));
    dp[1][0] = 0;

    for (int mask = 1; mask < full; ++mask) {
        for (int u = 0; u < n; ++u) {
            if (!(mask >> u & 1) || dp[mask][u] >= INF) continue;
            for (int v = 0; v < n; ++v) {
                if (mask >> v & 1) continue;
                int next = mask | (1 << v);
                if (dp[mask][u] + dist[u][v] < dp[next][v]) {
                    dp[next][v] = dp[mask][u] + dist[u][v];
                    parent[next][v] = u;   // remember which vertex we came from
                }
            }
        }
    }

    int last = -1, best = INF;
    for (int u = 1; u < n; ++u) {
        if (dp[full - 1][u] >= INF) continue;
        if (dp[full - 1][u] + dist[u][0] < best) {
            best = dp[full - 1][u] + dist[u][0];
            last = u;
        }
    }
    if (last == -1) return {};

    // Unwind: strip the current vertex out of the mask on every step back.
    vector<int> tour;
    int mask = full - 1;
    for (int u = last; u != -1;) {
        tour.push_back(u);
        int prev = parent[mask][u];
        mask ^= (1 << u);
        u = prev;
    }
    reverse(tour.begin(), tour.end());
    tour.push_back(0);   // back to the depot
    return tour;
}`

/* ------------------------------------------------------------------ */
/* topicId -> one standard, efficient, well-commented C++17 solution   */
/* ------------------------------------------------------------------ */

export const GRAPH_ALGO_CPP_EXTRA: Record<string, AlgoCppSolution> = {
  /* representations */
  'a8-graph-representation': {
    caption: 'Adjacency list, matrix and edge list side by side — C++',
    code: GRAPH_REP_CPP,
  },
  'a8-adjacency-list': { caption: 'Adjacency list build and queries — C++', code: ADJ_LIST_CPP },
  'a8-adjacency-matrix': { caption: 'Adjacency matrix build and queries — C++', code: ADJ_MATRIX_CPP },
  'a8-edge-list': { caption: 'Edge list for weight-driven algorithms — C++', code: EDGE_LIST_CPP },
  'a8-transitive-closure': { caption: "Warshall's boolean reachability DP — C++", code: TRANSITIVE_CPP },
  'a8-graph-from-degrees': { caption: 'Havel-Hakimi degree-sequence test — C++', code: HAVEL_CPP },

  /* cloning */
  'a8-clone-graph': { caption: 'BFS deep copy with an original-to-clone map — C++', code: CLONE_GRAPH_CPP },
  'a8-clone-dag': { caption: 'DFS deep copy with a memo table — C++', code: CLONE_DAG_CPP },

  /* grids and implicit graphs */
  'a8-grid-as-graph': { caption: 'Grid as an implicit graph (D4/D8 + flattening) — C++', code: GRID_CPP },
  'a8-flood-fill': { caption: 'BFS flood fill with recolour-as-visited — C++', code: FLOOD_CPP },
  'a8-number-of-islands': { caption: 'DFS island sinking component count — C++', code: ISLANDS_CPP },
  'a8-rotten-oranges': { caption: 'Multi-source BFS with per-minute layers — C++', code: ROTTEN_CPP },
  'a8-word-ladder': { caption: 'BFS over generated one-letter neighbours — C++', code: WORD_LADDER_CPP },
  'a8-snakes-and-ladders': { caption: 'BFS on flattened board labels — C++', code: SNAKES_CPP },
  'a8-shortest-path-binary-matrix': {
    caption: '8-directional grid BFS with mark-on-enqueue — C++',
    code: BIN_MATRIX_CPP,
  },
  'a8-pacific-atlantic': { caption: 'Two reversed multi-source searches, intersected — C++', code: PACIFIC_CPP },
  'a8-steps-by-knight': { caption: 'BFS over knight moves on the board graph — C++', code: KNIGHT_CPP },
  'a8-water-jug': { caption: 'BFS over jug states (plus the gcd shortcut) — C++', code: WATER_CPP },
  'a8-boggle': { caption: 'Trie-pruned backtracking on the letter board — C++', code: BOGGLE_CPP },

  /* cycles */
  'a8-cycle-undirected-dfs': { caption: 'DFS with a parent check (and edge ids) — C++', code: CYCLE_UNDIRECTED_DFS_CPP },
  'a8-cycle-undirected-bfs': { caption: 'BFS carrying the parent in the queue state — C++', code: CYCLE_UNDIRECTED_BFS_CPP },
  'a8-print-shortest-cycle': { caption: 'BFS from every source to find the girth — C++', code: SHORTEST_CYCLE_CPP },
  'a8-cycles-of-length-n': { caption: 'Backtracking count of fixed-length cycles — C++', code: CYCLES_N_CPP },
  'a8-print-all-cycles': { caption: 'Backtracking enumeration with canonical dedup — C++', code: ALL_CYCLES_CPP },
  'a8-cycle-detection': { caption: 'Three-state DFS and Kahn count, plus the undirected case — C++', code: CYCLE_DETECTION_CPP },
  'a8-cycle-directed-bfs-kahn': { caption: "Kahn's elimination as a cycle test — C++", code: DIRECTED_KAHN_CYCLE_CPP },
  'a8-cycle-using-colors': { caption: 'WHITE/GRAY/BLACK DFS with cycle extraction — C++', code: COLORS_CPP },
  'a8-negative-cycle-detection': {
    caption: 'Bellman-Ford from all-zero distances, with witness — C++',
    code: NEG_CYCLE_CPP,
  },

  /* topological order and DAG DP */
  'a8-topological-sorting': { caption: "Kahn's topological sort (plus lexicographic variant) — C++", code: KAHN_CPP },
  'a8-dag-dp': { caption: 'DP in topological order (longest path, path counts) — C++', code: DAG_DP_CPP },
  'a8-topo-departure-time': { caption: 'Topological order by DFS departure time — C++', code: TOPO_DEP_CPP },
  'a8-all-topological-sorts': { caption: 'Backtracking over zero-indegree choices — C++', code: ALL_TOPO_CPP },
  'a8-max-edges-keep-dag': { caption: 'V(V-1)/2 forward edges of a total order — C++', code: MAX_EDGES_DAG_CPP },
  'a8-longest-path-dag': { caption: 'Longest weighted path by topological relaxation — C++', code: LONGEST_DAG_CPP },
  'a8-find-itinerary': { caption: 'Hierholzer over min-heaps of destinations — C++', code: ITINERARY_CPP },
  'a8-course-schedule': { caption: "Kahn's algorithm on the prerequisite DAG — C++", code: COURSE_CPP },

  /* bipartite */
  'a8-bipartite-bfs': { caption: 'BFS two-colouring with parity by layer — C++', code: BIPARTITE_BFS_CPP },
  'a8-bipartite-dfs': { caption: 'DFS two-colouring with odd-cycle witness — C++', code: BIPARTITE_DFS_CPP },
  'a8-two-clique-problem': { caption: 'Two cliques iff the complement is bipartite — C++', code: TWO_CLIQUE_CPP },

  /* components, sinks, forests */
  'a8-components-bfs': { caption: 'BFS component count and labelling — C++', code: COMP_BFS_CPP },
  'a8-components-dfs': { caption: 'DFS component count (recursive and iterative) — C++', code: COMP_DFS_CPP },
  'a8-largest-region': { caption: 'Flood fill returning the region area — C++', code: LARGEST_CPP },
  'a8-count-trees-in-forest': { caption: 'Per-component tree test via the edge/vertex identity — C++', code: FOREST_CPP },
  'a8-universal-sink': { caption: 'O(V) matrix walk plus O(V) verification — C++', code: UNI_SINK_CPP },
  'a8-number-of-sinks': { caption: 'Out-degree zero scan (and the source mirror) — C++', code: NUM_SINKS_CPP },

  /* disjoint set union */
  'a8-dsu-path-compression': { caption: 'DSU find with path compression — C++', code: DSU_PC_CPP },
  'a8-dsu-union-by-rank': { caption: 'DSU union by rank (height bound) — C++', code: DSU_RANK_CPP },
  'a8-dsu-union-by-size': { caption: 'DSU union by size with size queries — C++', code: DSU_SIZE_CPP },
  'a8-dsu-on-grids': { caption: 'DSU over flattened grid ids (islands II) — C++', code: DSU_GRID_CPP },
  'a8-dynamic-connectivity': { caption: 'Incremental DSU connectivity plus rollback — C++', code: DYN_CONN_CPP },

  /* shortest paths */
  'a8-dijkstra-priority-queue': { caption: 'Lazy Dijkstra with a binary heap — C++', code: DIJK_PQ_CPP },
  'a8-dijkstra-set': { caption: 'Dijkstra with an ordered set as decrease-key — C++', code: DIJK_SET_CPP },
  'a8-dijkstra-print-path': { caption: 'Dijkstra with parent pointers and path counts — C++', code: DIJK_PATH_CPP },
  'a8-dijkstra-limitations': {
    caption: 'Negative-edge counterexample: Dijkstra wrong, Bellman-Ford right — C++',
    code: DIJK_LIMITS_CPP,
  },
  'a8-dials-algorithm': { caption: "Dial's bucket-queue Dijkstra for small weights — C++", code: DIALS_CPP },
  'a8-desopo-pape': { caption: "D'Esopo-Pape deque shortest paths — C++", code: DESOPO_CPP },
  'a8-bellman-ford-relaxation': { caption: 'V-1 relaxation rounds (plus SPFA) — C++', code: BF_REL_CPP },
  'a8-bellman-ford-negative-cycle': {
    caption: 'The V-th pass as a negative-cycle detector — C++',
    code: BF_NEG_CPP,
  },
  'a8-floyd-warshall-all-pairs': {
    caption: 'Floyd-Warshall with path reconstruction — C++',
    code: FLOYD_CPP,
  },
  'a8-johnsons-algorithm': { caption: 'Johnson reweighting + per-source Dijkstra — C++', code: JOHNSON_CPP },
  'a8-multistage-graph': { caption: 'Backward stage DP on a forward-only graph — C++', code: MULTI_STAGE_CPP },
  'a8-shortest-path-binary-graph': { caption: '0-1 BFS with a deque — C++', code: BIN_GRAPH_CPP },
  'a8-minimum-mean-weight-cycle': { caption: "Karp's minimum mean cycle DP — C++", code: MEAN_CYCLE_CPP },

  /* spanning trees */
  'a8-connect-all-cities': { caption: 'Kruskal MST over connection costs — C++', code: CONNECT_CITIES_CPP },
  'a8-total-spanning-trees': { caption: 'Kirchhoff matrix-tree theorem via determinant — C++', code: TOTAL_ST_CPP },
  'a8-minimum-product-spanning-tree': { caption: 'MST on log weights minimises the product — C++', code: MIN_PROD_ST_CPP },
  'a8-reverse-delete-mst': { caption: 'Reverse-delete MST using the cycle property — C++', code: REV_DEL_CPP },
  'a8-boruvka-mst': { caption: "Boruvka's simultaneous cheapest-edge rounds — C++", code: BORUVKA_CPP },

  /* strong connectivity */
  'a8-scc': { caption: 'Tarjan one-pass SCC (and Kosaraju two-pass) — C++', code: SCC_CPP },
  'a8-condensation-dag': { caption: 'Contract SCCs into a deduplicated DAG — C++', code: CONDENSE_CPP },
  'a8-count-walks-k-edges': { caption: 'Adjacency-matrix power by binary exponentiation — C++', code: WALKS_K_CPP },
  'a8-string-chain-circle': { caption: 'Euler circuit over first/last letters — C++', code: STRING_CHAIN_CPP },

  /* bridges, cut vertices, biconnectivity */
  'a8-bridges-tarjan': { caption: 'Bridges with disc/low (strict low[v] > disc[u]) — C++', code: BRIDGES_CPP },
  'a8-critical-connections': { caption: 'Critical connections are exactly the bridges — C++', code: BRIDGES_CPP },
  'a8-articulation-tarjan': { caption: 'Articulation points with disc/low and the root rule — C++', code: ARTICULATION_CPP },
  'a8-biconnected-components': { caption: 'Edge-stack biconnected components — C++', code: BCC_CPP },

  /* flows, cuts, matchings */
  'a8-max-flow': { caption: 'Edmonds-Karp with residual reverse arcs — C++', code: MAX_FLOW_CPP },
  'a8-dinic': { caption: 'Dinic level graph + blocking flow — C++', code: DINIC_CPP },
  'a8-bipartite-matching-flow': { caption: 'Unit-capacity flow for maximum matching — C++', code: BIP_FLOW_CPP },
  'a8-push-relabel': { caption: 'FIFO push-relabel with a height function — C++', code: PUSH_REL_CPP },
  'a8-max-edge-disjoint-paths': { caption: 'Unit-capacity max flow (Menger) — C++', code: EDGE_DISJ_CPP },
  'a8-min-st-cut': { caption: 'Max flow then residual reachability for the cut — C++', code: MIN_CUT_CPP },
  'a8-hopcroft-karp': { caption: 'Hopcroft-Karp layered augmentation — C++', code: HK_CPP },
  'a8-channel-assignment': { caption: 'Greedy and Welsh-Powell channel colouring — C++', code: CHANNEL_CPP },
  'a8-kargers-algorithm': { caption: 'Randomised contraction global min cut — C++', code: KARGER_CPP },

  /* Euler tours */
  'a8-euler-path': { caption: 'Undirected Hierholzer with edge ids + existence test — C++', code: EULER_CPP },
  'a8-euler-circuit-directed': { caption: 'Directed Euler circuit and open path — C++', code: EULER_DIR_CPP },
  'a8-fleury-algorithm': { caption: "Fleury's never-cross-a-bridge rule — C++", code: FLEURY_CPP },
  'a8-chinese-postman': { caption: 'Odd-vertex matching over APSP, then Euler — C++', code: POSTMAN_CPP },

  /* colouring and hard tours */
  'a8-graph-coloring': { caption: 'Backtracking m-colouring plus greedy bound — C++', code: COLOR_CPP },
  'a8-traveling-salesman': { caption: 'Held-Karp bitmask DP with tour recovery — C++', code: TSP_CPP },
  'a8-shortest-chain-target-word': {
    caption: 'BFS over generated one-letter neighbours — C++',
    code: WORD_LADDER_CPP,
  },
}

export function getAlgoCppExtra(topicId: string): AlgoCppSolution | undefined {
  return GRAPH_ALGO_CPP_EXTRA[topicId]
}
