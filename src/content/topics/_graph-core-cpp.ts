/**
 * C++17 counterparts of the Java solutions in `_graph-core-pack.ts`.
 * Same 25 algorithms, same topicIds, same problem intent — idiomatic
 * competitive-programming C++ instead of Java collections.
 */

export type CoreCppSolution = {
  caption: string
  code: string
}

const BFS_CPP = `#include <bits/stdc++.h>
using namespace std;

// Level-order traversal. The outer loop restarts BFS at every unvisited vertex
// so disconnected graphs are covered completely.
vector<int> bfsOrder(int n, const vector<vector<int>>& adj) {
    vector<char> visited(n, 0);
    vector<int> order;
    order.reserve(n);

    for (int s = 0; s < n; ++s) {
        if (visited[s]) continue;

        queue<int> q;
        // Mark on ENQUEUE, never on dequeue. If we marked on dequeue, a vertex
        // reachable from two frontier vertices would be pushed (and expanded)
        // twice, blowing up the work on dense graphs.
        visited[s] = 1;
        q.push(s);

        while (!q.empty()) {
            int u = q.front();   // FIFO => vertices leave in non-decreasing depth
            q.pop();
            order.push_back(u);
            for (int v : adj[u]) {
                if (!visited[v]) {
                    visited[v] = 1;
                    q.push(v);
                }
            }
        }
    }
    return order;
}`

const DFS_RECURSIVE_CPP = `#include <bits/stdc++.h>
using namespace std;

void dfs(int u, const vector<vector<int>>& adj, vector<char>& visited, vector<int>& order) {
    visited[u] = 1;          // mark BEFORE recursing, otherwise a cycle re-enters u forever
    order.push_back(u);      // preorder position of u

    for (int v : adj[u]) {
        if (!visited[v]) dfs(v, adj, visited, order);
    }
    // Postorder point: everything reachable from u is finished here. Topological
    // sort, SCC and low-link algorithms all hang their work off this line.
}

vector<int> dfsOrder(int n, const vector<vector<int>>& adj) {
    vector<char> visited(n, 0);
    vector<int> order;
    order.reserve(n);
    // One top-level call per component; without this loop we only see the
    // component containing vertex 0.
    for (int s = 0; s < n; ++s) {
        if (!visited[s]) dfs(s, adj, visited, order);
    }
    return order;
}`

const DFS_ITERATIVE_CPP = `#include <bits/stdc++.h>
using namespace std;

// Explicit stack version: same order as recursion, but immune to stack overflow.
vector<int> dfsOrderIterative(int n, const vector<vector<int>>& adj) {
    vector<char> visited(n, 0);
    vector<int> order;
    order.reserve(n);
    vector<int> st;   // vector as a stack: cheaper than std::stack's deque

    for (int s = 0; s < n; ++s) {
        if (visited[s]) continue;
        st.push_back(s);

        while (!st.empty()) {
            int u = st.back();
            st.pop_back();
            // Mark on POP, not on push. The same vertex can legitimately sit on
            // the stack several times; only the first pop should expand it, so
            // we filter the stale copies here.
            if (visited[u]) continue;
            visited[u] = 1;
            order.push_back(u);

            // Push neighbours in reverse so they pop in adjacency-list order,
            // reproducing recursive DFS exactly.
            for (auto it = adj[u].rbegin(); it != adj[u].rend(); ++it) {
                if (!visited[*it]) st.push_back(*it);
            }
        }
    }
    return order;
}`

const MULTI_SOURCE_BFS_CPP = `#include <bits/stdc++.h>
using namespace std;

// dist[v] = number of edges to the NEAREST source, or -1 if unreachable.
vector<int> multiSourceBfs(int n, const vector<vector<int>>& adj, const vector<int>& sources) {
    vector<int> dist(n, -1);
    queue<int> q;

    // Seed EVERY source at distance 0 before the loop starts. This is equivalent
    // to adding a virtual super-source with zero-cost edges, so the usual BFS
    // layer argument still applies and each vertex is settled by its closest source.
    for (int s : sources) {
        if (dist[s] != -1) continue;   // guard duplicated sources
        dist[s] = 0;
        q.push(s);
    }

    while (!q.empty()) {
        int u = q.front();
        q.pop();
        for (int v : adj[u]) {
            if (dist[v] == -1) {
                dist[v] = dist[u] + 1;
                q.push(v);
            }
        }
    }
    return dist;
}`

const CYCLE_UNDIRECTED_CPP = `#include <bits/stdc++.h>
using namespace std;

bool hasCycleFrom(int u, int parent, const vector<vector<int>>& adj, vector<char>& visited) {
    visited[u] = 1;
    for (int v : adj[u]) {
        // Every undirected edge appears twice, so the edge we arrived on would
        // look like a cycle. Skipping the parent removes that false positive.
        if (v == parent) continue;

        // A visited, non-parent neighbour is a back edge to an ancestor => cycle.
        if (visited[v]) return true;

        if (hasCycleFrom(v, u, adj, visited)) return true;
    }
    return false;
}

bool hasCycleUndirected(int n, const vector<vector<int>>& adj) {
    vector<char> visited(n, 0);
    for (int s = 0; s < n; ++s) {
        if (!visited[s] && hasCycleFrom(s, -1, adj, visited)) return true;
    }
    return false;
}`

const CYCLE_DIRECTED_CPP = `#include <bits/stdc++.h>
using namespace std;

enum Color { WHITE = 0, GRAY = 1, BLACK = 2 };   // untouched / on stack / finished

bool dfsDirected(int u, const vector<vector<int>>& adj, vector<int>& color) {
    color[u] = GRAY;   // u enters the active path
    for (int v : adj[u]) {
        // GRAY neighbour = edge back into the active path = directed cycle.
        if (color[v] == GRAY) return true;

        if (color[v] == WHITE && dfsDirected(v, adj, color)) return true;

        // A BLACK neighbour is already finished and cannot reach u, so it is safe.
        // This is exactly why a plain "visited" flag is not enough for digraphs.
    }
    color[u] = BLACK;  // u leaves the active path
    return false;
}

bool hasCycleDirected(int n, const vector<vector<int>>& adj) {
    vector<int> color(n, WHITE);
    for (int s = 0; s < n; ++s) {
        if (color[s] == WHITE && dfsDirected(s, adj, color)) return true;
    }
    return false;
}`

const TOPO_KAHN_CPP = `#include <bits/stdc++.h>
using namespace std;

// Returns a topological order, or an empty vector if the graph has a cycle.
vector<int> topoSortKahn(int n, const vector<vector<int>>& adj) {
    vector<int> indeg(n, 0);
    for (int u = 0; u < n; ++u) {
        for (int v : adj[u]) ++indeg[v];
    }

    queue<int> q;
    // Indegree 0 means "no unmet prerequisite", so these are safe to output now.
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
            // u is now placed, so one prerequisite of v is satisfied. Enqueue v
            // only when the last one drops away; that keeps every vertex enqueued once.
            if (--indeg[v] == 0) q.push(v);
        }
    }

    // Emitted fewer than n vertices => some indegrees never reached 0 => cycle.
    if ((int)order.size() != n) return {};
    return order;
}`

const TOPO_DFS_CPP = `#include <bits/stdc++.h>
using namespace std;

enum TopoState { UNVISITED = 0, IN_STACK = 1, DONE = 2 };

// Returns false as soon as a back edge (cycle) is found.
bool topoDfs(int u, const vector<vector<int>>& adj, vector<int>& state, vector<int>& finished) {
    state[u] = IN_STACK;
    for (int v : adj[u]) {
        if (state[v] == IN_STACK) return false;   // back edge => not a DAG => no order
        if (state[v] == UNVISITED && !topoDfs(v, adj, state, finished)) return false;
    }
    state[u] = DONE;
    // u is appended only after every descendant is appended, so u ends up later
    // in finished[], i.e. earlier once we reverse.
    finished.push_back(u);
    return true;
}

// Reverse postorder DFS. Returns an empty vector when a cycle exists.
vector<int> topoSortDfs(int n, const vector<vector<int>>& adj) {
    vector<int> state(n, UNVISITED), finished;
    finished.reserve(n);

    for (int s = 0; s < n; ++s) {
        if (state[s] == UNVISITED && !topoDfs(s, adj, state, finished)) return {};
    }

    reverse(finished.begin(), finished.end());   // reverse postorder = topological order
    return finished;
}`

const BFS_SHORTEST_UNWEIGHTED_CPP = `#include <bits/stdc++.h>
using namespace std;

// Returns the vertex list of a shortest src->dst path, or an empty vector if unreachable.
vector<int> bfsShortestPath(int n, const vector<vector<int>>& adj, int src, int dst) {
    vector<int> dist(n, -1);     // -1 doubles as "not visited yet"
    vector<int> parent(n, -1);

    queue<int> q;
    dist[src] = 0;
    q.push(src);

    while (!q.empty()) {
        int u = q.front();
        q.pop();
        if (u == dst) break;     // BFS finalises a vertex on its first dequeue

        for (int v : adj[u]) {
            if (dist[v] != -1) continue;
            // Unit weights: the first time BFS reaches v it is via a shortest path,
            // so the distance and the parent pointer can be fixed immediately.
            dist[v] = dist[u] + 1;
            parent[v] = u;
            q.push(v);
        }
    }

    if (dist[dst] == -1) return {};

    // Walk parents backwards, then reverse to get src -> dst order.
    vector<int> path;
    for (int cur = dst; cur != -1; cur = parent[cur]) path.push_back(cur);
    reverse(path.begin(), path.end());
    return path;
}`

const SHORTEST_PATH_DAG_CPP = `#include <bits/stdc++.h>
using namespace std;

const long long INF = LLONG_MAX / 4;   // /4 leaves headroom so INF + w cannot overflow

// adj[u] holds {v, w} pairs. Weights may be negative: a DAG has no cycles.
vector<long long> dagShortestPaths(int n, const vector<vector<pair<int, int>>>& adj, int src) {
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

    // Step 2: single relaxation sweep in that order.
    vector<long long> dist(n, INF);
    dist[src] = 0;
    for (int u : order) {
        // When u is reached in topological order, every path into u has already
        // been relaxed, so dist[u] is final. One pass per edge is therefore enough.
        if (dist[u] == INF) continue;   // never relax out of an unreachable vertex
        for (auto& e : adj[u]) {
            if (dist[u] + e.second < dist[e.first]) dist[e.first] = dist[u] + e.second;
        }
    }
    return dist;
}`

const DIJKSTRA_CPP = `#include <bits/stdc++.h>
using namespace std;

const long long INF = LLONG_MAX / 4;

// adj[u] holds {v, w} pairs with w >= 0.
vector<long long> dijkstra(int n, const vector<vector<pair<int, int>>>& adj, int src) {
    vector<long long> dist(n, INF);
    dist[src] = 0;

    // Lazy Dijkstra: heap entries are {distance, vertex}. There is no decrease-key
    // on a binary heap, so we push an improved copy and discard stale ones on pop.
    // The heap holds O(E) entries, which is still O(E log V) overall.
    using Item = pair<long long, int>;
    priority_queue<Item, vector<Item>, greater<Item>> pq;   // greater<> => min-heap
    pq.push({0LL, src});

    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();

        // Stale entry: u was already settled with a smaller key. Skipping here is
        // what keeps each vertex expanded exactly once.
        if (d > dist[u]) continue;

        for (auto& [v, w] : adj[u]) {
            long long nd = d + w;   // long long: 1e5 edges of weight 1e9 overflows int
            if (nd < dist[v]) {
                dist[v] = nd;       // relax, then publish the new key to the heap
                pq.push({nd, v});
            }
        }
    }
    return dist;
}`

const BELLMAN_FORD_CPP = `#include <bits/stdc++.h>
using namespace std;

const long long INF = LLONG_MAX / 4;

struct Edge {
    int u, v, w;
};

// Returns false (and leaves dist unusable) if a negative cycle is reachable from src.
bool bellmanFord(int n, const vector<Edge>& edges, int src, vector<long long>& dist) {
    dist.assign(n, INF);
    dist[src] = 0;

    // After round i, every shortest path that uses at most i edges is correct.
    // A simple shortest path uses at most n-1 edges, hence n-1 rounds.
    for (int round = 0; round < n - 1; ++round) {
        bool changed = false;
        for (const Edge& e : edges) {
            // Relaxing from INF would create bogus finite distances (INF + w).
            if (dist[e.u] == INF) continue;
            if (dist[e.u] + e.w < dist[e.v]) {
                dist[e.v] = dist[e.u] + e.w;
                changed = true;
            }
        }
        if (!changed) break;   // fixed point reached early; common on real inputs
    }

    // One extra pass: any edge that still relaxes proves a negative cycle,
    // because no simple path can improve after n-1 rounds.
    for (const Edge& e : edges) {
        if (dist[e.u] != INF && dist[e.u] + e.w < dist[e.v]) return false;
    }
    return true;
}`

const FLOYD_WARSHALL_CPP = `#include <bits/stdc++.h>
using namespace std;

const int INF = 1000000000;   // large but safe: INF + INF stays inside int

// dist[i][j] starts as the direct edge weight (INF if absent, 0 on the diagonal)
// and is rewritten in place into all-pairs shortest distances.
void floydWarshall(int n, vector<vector<int>>& dist) {
    // k must be the OUTERMOST loop: it is the DP layer "paths whose intermediate
    // vertices all come from {0..k}". Any other loop order is simply wrong.
    for (int k = 0; k < n; ++k) {
        for (int i = 0; i < n; ++i) {
            if (dist[i][k] >= INF) continue;   // no i->k leg, whole row unaffected by k
            for (int j = 0; j < n; ++j) {
                if (dist[k][j] >= INF) continue;
                int through = dist[i][k] + dist[k][j];
                if (through < dist[i][j]) dist[i][j] = through;
            }
        }
    }
}

// Negative cycle through i iff its distance to itself became negative.
bool hasNegativeCycle(int n, const vector<vector<int>>& dist) {
    for (int i = 0; i < n; ++i) {
        if (dist[i][i] < 0) return true;
    }
    return false;
}`

const ZERO_ONE_BFS_CPP = `#include <bits/stdc++.h>
using namespace std;

// adj[u] holds {v, w} pairs where w is 0 or 1.
vector<int> zeroOneBfs(int n, const vector<vector<pair<int, int>>>& adj, int src) {
    vector<int> dist(n, INT_MAX);
    dist[src] = 0;

    deque<int> dq;
    dq.push_front(src);

    while (!dq.empty()) {
        int u = dq.front();
        dq.pop_front();
        for (auto& [v, w] : adj[u]) {
            // The relax check also filters stale deque entries, so no visited[] needed.
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                // A 0-edge keeps v in the CURRENT layer, so it goes to the front; a
                // 1-edge moves it to the next layer, so it goes to the back. That
                // ordering makes the deque behave like a 2-bucket priority queue.
                if (w == 0) dq.push_front(v);
                else dq.push_back(v);
            }
        }
    }
    return dist;
}`

const PRIM_CPP = `#include <bits/stdc++.h>
using namespace std;

// adj[u] holds {v, w} pairs. Returns total MST weight, or -1 if disconnected.
long long primMst(int n, const vector<vector<pair<int, int>>>& adj) {
    vector<char> inMst(n, 0);
    // {weight, vertex} keyed by the cheapest known edge crossing the cut.
    using Item = pair<int, int>;
    priority_queue<Item, vector<Item>, greater<Item>> pq;
    pq.push({0, 0});   // any start vertex works for an MST

    long long total = 0;
    int taken = 0;
    while (!pq.empty() && taken < n) {
        auto [w, u] = pq.top();
        pq.pop();

        // Lazy heap: u may already be attached by a cheaper crossing edge.
        if (inMst[u]) continue;

        // Cut property: the lightest edge crossing the (tree, rest) cut is always
        // in some MST, and the heap minimum is exactly that edge.
        inMst[u] = 1;
        total += w;
        ++taken;

        for (auto& [v, weight] : adj[u]) {
            if (!inMst[v]) pq.push({weight, v});
        }
    }
    return taken == n ? total : -1;
}`

const KRUSKAL_CPP = `#include <bits/stdc++.h>
using namespace std;

struct DSU {
    vector<int> parent, rnk;

    explicit DSU(int n) : parent(n), rnk(n, 0) {
        iota(parent.begin(), parent.end(), 0);
    }

    int find(int x) {
        // Path compression: re-point every node on the path straight at the root.
        return parent[x] == x ? x : parent[x] = find(parent[x]);
    }

    bool unite(int a, int b) {
        a = find(a);
        b = find(b);
        if (a == b) return false;   // same component already => this edge closes a cycle
        if (rnk[a] < rnk[b]) swap(a, b);   // union by rank: small under large
        parent[b] = a;
        if (rnk[a] == rnk[b]) ++rnk[a];
        return true;
    }
};

struct Edge {
    int u, v, w;
};

// Returns {totalWeight, edgesUsed}; used == n-1 means the result spans the graph.
pair<long long, int> kruskalMst(int n, vector<Edge> edges) {
    // Greedy: consider edges lightest first. Sorting dominates the runtime.
    sort(edges.begin(), edges.end(), [](const Edge& a, const Edge& b) { return a.w < b.w; });

    DSU dsu(n);
    long long total = 0;
    int used = 0;
    for (const Edge& e : edges) {
        // DSU is the cycle test: accept the edge only if it joins two components.
        if (dsu.unite(e.u, e.v)) {
            total += e.w;
            if (++used == n - 1) break;   // tree complete, remaining edges are redundant
        }
    }
    return {total, used};
}`

const UNION_FIND_CPP = `#include <bits/stdc++.h>
using namespace std;

struct DSU {
    vector<int> parent;
    vector<int> rnk;        // upper bound on tree height
    vector<int> compSize;
    int components;

    explicit DSU(int n) : parent(n), rnk(n, 0), compSize(n, 1), components(n) {
        iota(parent.begin(), parent.end(), 0);   // every element starts as its own root
    }

    // Path compression: after the recursion unwinds, every node on the query path
    // points directly at the root, so repeated queries are effectively O(1).
    int find(int x) {
        return parent[x] == x ? x : parent[x] = find(parent[x]);
    }

    // Union by rank keeps the tree shallow. Returns false if a and b were already joined.
    bool unite(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false;

        // Hang the shorter tree under the taller one so the height does not grow.
        if (rnk[ra] < rnk[rb]) swap(ra, rb);
        parent[rb] = ra;
        compSize[ra] += compSize[rb];

        // Height increases only when both trees were equally tall.
        if (rnk[ra] == rnk[rb]) ++rnk[ra];

        --components;
        return true;
    }

    bool connected(int a, int b) { return find(a) == find(b); }

    int sizeOf(int x) { return compSize[find(x)]; }

    int componentCount() const { return components; }
};`

const CONNECTED_COMPONENTS_CPP = `#include <bits/stdc++.h>
using namespace std;

// Returns comp[v] = component id in 0..count-1, and writes the count via out-param.
vector<int> connectedComponents(int n, const vector<vector<int>>& adj, int& count) {
    vector<int> comp(n, -1);
    count = 0;
    queue<int> q;

    for (int s = 0; s < n; ++s) {
        // Every unlabelled vertex is unreachable from all previous ones,
        // so it necessarily opens a brand-new component.
        if (comp[s] != -1) continue;

        comp[s] = count;
        q.push(s);
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            for (int v : adj[u]) {
                if (comp[v] == -1) {
                    comp[v] = count;   // label acts as the visited marker
                    q.push(v);
                }
            }
        }
        ++count;
    }
    return comp;
}

int countComponents(int n, const vector<vector<int>>& adj) {
    int count = 0;
    connectedComponents(n, adj, count);
    return count;
}`

const BRIDGES_CPP = `#include <bits/stdc++.h>
using namespace std;

struct BridgeFinder {
    int timer = 0;
    vector<int> disc, low;
    vector<pair<int, int>> bridges;

    // adj[u] holds {v, edgeId} pairs, with the same edgeId on both directions.
    // Tracking the edge id (instead of the parent vertex) keeps parallel edges correct.
    vector<pair<int, int>> findBridges(int n, const vector<vector<pair<int, int>>>& adj) {
        disc.assign(n, -1);
        low.assign(n, 0);
        bridges.clear();
        timer = 0;

        for (int s = 0; s < n; ++s) {
            if (disc[s] == -1) dfs(s, -1, adj);
        }
        return bridges;
    }

    void dfs(int u, int inEdgeId, const vector<vector<pair<int, int>>>& adj) {
        disc[u] = low[u] = timer++;
        for (auto& [v, id] : adj[u]) {
            // Skip only the exact edge we entered on. A second, parallel u-v edge
            // must still be explored: it makes both copies non-bridges.
            if (id == inEdgeId) continue;

            if (disc[v] == -1) {
                dfs(v, id, adj);
                low[u] = min(low[u], low[v]);

                // Strict >: v's subtree has no back edge to u or above, so removing
                // (u,v) disconnects it. Equality would mean a back edge reaches u itself.
                if (low[v] > disc[u]) bridges.push_back({u, v});
            } else {
                low[u] = min(low[u], disc[v]);   // back edge climbs to an ancestor
            }
        }
    }
};`

const ARTICULATION_POINTS_CPP = `#include <bits/stdc++.h>
using namespace std;

struct ArticulationPointFinder {
    int timer = 0;
    vector<int> disc, low;
    vector<char> isCut;

    vector<int> findArticulationPoints(int n, const vector<vector<int>>& adj) {
        disc.assign(n, -1);
        low.assign(n, 0);
        isCut.assign(n, 0);
        timer = 0;

        for (int s = 0; s < n; ++s) {
            if (disc[s] == -1) dfs(s, -1, adj);
        }
        vector<int> result;
        for (int v = 0; v < n; ++v) {
            if (isCut[v]) result.push_back(v);
        }
        return result;
    }

    void dfs(int u, int parent, const vector<vector<int>>& adj) {
        disc[u] = low[u] = timer++;
        int children = 0;   // DFS-tree children, needed for the root rule below

        for (int v : adj[u]) {
            if (v == parent) continue;   // do not treat the incoming edge as a back edge

            if (disc[v] == -1) {
                ++children;
                dfs(v, u, adj);
                low[u] = min(low[u], low[v]);

                // low[v] >= disc[u] means v's subtree cannot bypass u, so deleting u
                // detaches it. Note >= here (bridges use >) because u itself counts.
                if (parent != -1 && low[v] >= disc[u]) isCut[u] = 1;
            } else {
                low[u] = min(low[u], disc[v]);
            }
        }

        // The root has no parent to fall back on, so it is a cut vertex exactly when
        // it stitches together two or more independent subtrees.
        if (parent == -1 && children > 1) isCut[u] = 1;
    }
};`

const KOSARAJU_CPP = `#include <bits/stdc++.h>
using namespace std;

void dfsFinishOrder(int u, const vector<vector<int>>& adj, vector<char>& visited, vector<int>& out) {
    visited[u] = 1;
    for (int v : adj[u]) {
        if (!visited[v]) dfsFinishOrder(v, adj, visited, out);
    }
    out.push_back(u);   // appended on finish, so the last element finished last
}

void collectScc(int u, const vector<vector<int>>& rev, vector<int>& comp, int id) {
    comp[u] = id;
    for (int v : rev[u]) {
        if (comp[v] == -1) collectScc(v, rev, comp, id);
    }
}

// Returns comp[v] = SCC id. Ids follow a topological order of the condensation.
vector<int> kosarajuScc(int n, const vector<vector<int>>& adj) {
    vector<vector<int>> rev(n);
    for (int u = 0; u < n; ++u) {
        for (int v : adj[u]) rev[v].push_back(u);
    }

    // Pass 1: order vertices by DFS finish time on the original graph.
    vector<char> visited(n, 0);
    vector<int> finishOrder;
    finishOrder.reserve(n);
    for (int s = 0; s < n; ++s) {
        if (!visited[s]) dfsFinishOrder(s, adj, visited, finishOrder);
    }

    // Pass 2: DFS the REVERSED graph, taking roots in decreasing finish time.
    // Reversing kills every edge that left the component, so a DFS started at the
    // "latest finished" vertex can reach exactly its own SCC and nothing more.
    vector<int> comp(n, -1);
    int id = 0;
    for (int i = n - 1; i >= 0; --i) {
        int s = finishOrder[i];
        if (comp[s] != -1) continue;
        collectScc(s, rev, comp, id++);
    }
    return comp;
}`

const TARJAN_SCC_CPP = `#include <bits/stdc++.h>
using namespace std;

struct TarjanScc {
    int timer = 0, sccCount = 0;
    vector<int> disc, low, comp, stk;
    vector<char> onStack;

    // Single-pass SCC. Returns comp[v] = SCC id in reverse topological order.
    vector<int> scc(int n, const vector<vector<int>>& adj) {
        disc.assign(n, -1);
        low.assign(n, 0);
        comp.assign(n, -1);
        onStack.assign(n, 0);
        stk.clear();
        timer = 0;
        sccCount = 0;

        for (int s = 0; s < n; ++s) {
            if (disc[s] == -1) dfs(s, adj);
        }
        return comp;
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
                low[u] = min(low[u], low[v]);    // tree edge: inherit the child's reach
            } else if (onStack[v]) {
                low[u] = min(low[u], disc[v]);   // back edge inside the current SCC
                // Use disc[v], not low[v]: low[v] may belong to a different subtree.
            }
            // Visited but not on the stack => v sits in an already-closed SCC. Pulling
            // its low value in would wrongly merge two components, so we ignore it.
        }

        // Nothing in u's subtree reaches above u => u is the root of an SCC, and the
        // stack above u is exactly that component.
        if (low[u] == disc[u]) {
            while (true) {
                int v = stk.back();
                stk.pop_back();
                onStack[v] = 0;
                comp[v] = sccCount;
                if (v == u) break;
            }
            ++sccCount;
        }
    }
};`

const BIPARTITE_CPP = `#include <bits/stdc++.h>
using namespace std;

bool isBipartite(int n, const vector<vector<int>>& adj) {
    vector<int> color(n, -1);   // -1 = uncoloured / unvisited

    for (int s = 0; s < n; ++s) {
        if (color[s] != -1) continue;   // one BFS per component; each is coloured freely
        color[s] = 0;
        queue<int> q;
        q.push(s);

        while (!q.empty()) {
            int u = q.front();
            q.pop();
            for (int v : adj[u]) {
                if (color[v] == -1) {
                    color[v] = color[u] ^ 1;   // XOR flips 0<->1: neighbours change side
                    q.push(v);
                } else if (color[v] == color[u]) {
                    // Same colour on both endpoints => odd-length cycle => not bipartite.
                    return false;
                }
            }
        }
    }
    return true;
}`

const EDMONDS_KARP_CPP = `#include <bits/stdc++.h>
using namespace std;

// cap[u][v] = remaining capacity of u->v. The matrix is mutated into the residual
// graph, so pass a copy if the original is needed afterwards.
long long edmondsKarp(int n, vector<vector<int>>& cap, int s, int t) {
    vector<int> parent(n);
    long long flow = 0;

    while (true) {
        fill(parent.begin(), parent.end(), -1);
        parent[s] = s;   // marks the source as visited without a real predecessor
        queue<int> q;
        q.push(s);

        // BFS, not DFS: choosing the augmenting path with the fewest edges bounds the
        // number of augmentations by O(V*E) independently of the capacity values.
        while (!q.empty() && parent[t] == -1) {
            int u = q.front();
            q.pop();
            for (int v = 0; v < n; ++v) {
                if (parent[v] == -1 && cap[u][v] > 0) {
                    parent[v] = u;
                    q.push(v);
                }
            }
        }

        // No s-t path left in the residual graph => max-flow min-cut says we are done.
        if (parent[t] == -1) break;

        // Bottleneck = smallest residual capacity along the path.
        int bottleneck = INT_MAX;
        for (int v = t; v != s; v = parent[v]) {
            bottleneck = min(bottleneck, cap[parent[v]][v]);
        }

        for (int v = t; v != s; v = parent[v]) {
            cap[parent[v]][v] -= bottleneck;   // consume forward capacity
            cap[v][parent[v]] += bottleneck;   // reverse capacity lets later paths undo this
        }
        flow += bottleneck;
    }
    return flow;
}`

const HIERHOLZER_CPP = `#include <bits/stdc++.h>
using namespace std;

// Euler path/circuit in a DIRECTED graph. out[u] lists u's out-neighbours.
// Returns the vertex sequence (length = edges + 1), or an empty vector if none exists.
vector<int> hierholzer(int n, const vector<vector<int>>& out) {
    // Adjacency as deques of UNUSED edges: popping deletes an edge in O(1), which is
    // what keeps the total work linear instead of rescanning used edges.
    vector<deque<int>> unused(n);
    vector<int> outDeg(n, 0), inDeg(n, 0);
    int edgeCount = 0;
    for (int u = 0; u < n; ++u) {
        for (int v : out[u]) {
            unused[u].push_back(v);
            ++outDeg[u];
            ++inDeg[v];
            ++edgeCount;
        }
    }

    // Degree test: a circuit needs out == in everywhere; a path allows exactly one
    // vertex with out-in = +1 (the start) and one with -1 (the end).
    int start = -1, plusOne = 0, minusOne = 0;
    for (int u = 0; u < n; ++u) {
        int diff = outDeg[u] - inDeg[u];
        if (diff == 1) { ++plusOne; start = u; }
        else if (diff == -1) ++minusOne;
        else if (diff != 0) return {};
    }
    if (plusOne > 1 || minusOne > 1) return {};
    if (start == -1) {
        for (int u = 0; u < n; ++u) {
            if (outDeg[u] > 0) { start = u; break; }
        }
    }
    if (start == -1) return {};   // no edges at all

    vector<int> stk, route;
    route.reserve(edgeCount + 1);
    stk.push_back(start);
    while (!stk.empty()) {
        int u = stk.back();
        if (unused[u].empty()) {
            // Stuck at u: every edge out of u is spent, so u's position in the final
            // walk is fixed. Recording it here builds the route back-to-front.
            route.push_back(u);
            stk.pop_back();
        } else {
            // Walk any unused edge and consume it; correctness does not depend on
            // which one, because detours get spliced in when we later revisit u.
            int v = unused[u].front();
            unused[u].pop_front();
            stk.push_back(v);
        }
    }
    reverse(route.begin(), route.end());

    // Connectivity check: a genuine Euler path uses every edge exactly once.
    if ((int)route.size() != edgeCount + 1) return {};
    return route;
}`

/** topicId → one standard, efficient, well-commented C++17 solution */
export const GRAPH_CORE_CPP: Record<string, CoreCppSolution> = {
  'a8-bfs': { caption: 'BFS traversal (all components) — C++', code: BFS_CPP },
  'a8-dfs': { caption: 'Recursive DFS (all components) — C++', code: DFS_RECURSIVE_CPP },
  'a8-iterative-dfs': { caption: 'Iterative DFS with explicit stack — C++', code: DFS_ITERATIVE_CPP },
  'a8-multi-source-bfs': { caption: 'Multi-source BFS with a pre-seeded queue — C++', code: MULTI_SOURCE_BFS_CPP },
  'a8-cycle-undirected': { caption: 'DFS + parent check — C++', code: CYCLE_UNDIRECTED_CPP },
  'a8-cycle-directed-dfs': { caption: 'DFS with WHITE/GRAY/BLACK colours — C++', code: CYCLE_DIRECTED_CPP },
  'a8-topo-kahn': { caption: "Kahn's algorithm (BFS topological sort) — C++", code: TOPO_KAHN_CPP },
  'a8-topo-dfs': { caption: 'DFS topological sort (reverse postorder) — C++', code: TOPO_DFS_CPP },
  'a8-bfs-shortest-unweighted': {
    caption: 'BFS shortest path with reconstruction — C++',
    code: BFS_SHORTEST_UNWEIGHTED_CPP,
  },
  'a8-shortest-path-dag': {
    caption: 'Topological order + single relaxation sweep — C++',
    code: SHORTEST_PATH_DAG_CPP,
  },
  'a8-dijkstra': { caption: 'Lazy Dijkstra with binary heap — C++', code: DIJKSTRA_CPP },
  'a8-bellman-ford': { caption: 'Bellman-Ford with negative-cycle check — C++', code: BELLMAN_FORD_CPP },
  'a8-floyd-warshall': { caption: 'Floyd-Warshall all-pairs shortest paths — C++', code: FLOYD_WARSHALL_CPP },
  'a8-0-1-bfs': { caption: '0-1 BFS with a deque — C++', code: ZERO_ONE_BFS_CPP },
  'a8-mst-prim': { caption: "Prim's MST with a lazy priority queue — C++", code: PRIM_CPP },
  'a8-mst-kruskal': { caption: "Kruskal's MST with sorting + DSU — C++", code: KRUSKAL_CPP },
  'a8-union-find': { caption: 'DSU with path compression + union by rank — C++', code: UNION_FIND_CPP },
  'a8-connected-components': { caption: 'BFS component labelling — C++', code: CONNECTED_COMPONENTS_CPP },
  'a8-bridges': { caption: 'Bridge finding with disc/low and edge ids — C++', code: BRIDGES_CPP },
  'a8-articulation-points': { caption: 'Articulation points with disc/low — C++', code: ARTICULATION_POINTS_CPP },
  'a8-kosaraju': { caption: 'Kosaraju two-pass SCC — C++', code: KOSARAJU_CPP },
  'a8-tarjan-scc': { caption: 'Tarjan single-pass SCC with disc/low — C++', code: TARJAN_SCC_CPP },
  'a8-bipartite': { caption: 'BFS 2-colouring bipartite check — C++', code: BIPARTITE_CPP },
  'a8-ford-fulkerson': {
    caption: 'Edmonds-Karp (BFS augmenting paths on a capacity matrix) — C++',
    code: EDMONDS_KARP_CPP,
  },
  'a8-hierholzer-algorithm': { caption: 'Hierholzer with per-vertex edge deques — C++', code: HIERHOLZER_CPP },
}

export function getCoreCppSolution(topicId: string): CoreCppSolution | undefined {
  return GRAPH_CORE_CPP[topicId]
}
