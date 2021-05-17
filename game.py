from random import shuffle, randrange
import json
class Cell:
    def __init__(self,e,w,n,s):
        self.e = True if e != "|  " else False
        self.w = True if w != "|  " else False
        self.s = True if s != "+--" else False
        self.n = True if n != "+--" else False
    def arr(self):
        return [self.n,self.e,self.s,self.w]
        
def make_maze(w = 20, h = 9):
    vis = [[0] * w + [1] for _ in range(h)] + [[1] * (w + 1)]
    ver = [["|  "] * w + ['|'] for _ in range(h)] + [[]]
    hor = [["+--"] * w + ['+'] for _ in range(h + 1)]

    def walk(x, y):
        vis[y][x] = 1

        d = [(x - 1, y), (x, y + 1), (x + 1, y), (x, y - 1)]
        shuffle(d)
        for (xx, yy) in d:
            if vis[yy][xx]: continue
            if xx == x: hor[max(y, yy)][x] = "+  "
            if yy == y: ver[y][max(x, xx)] = "   "
            walk(xx, yy)

    walk(randrange(w), randrange(h))
    

    def translateIntoWalls(hor_,ver_,width,height):
        w_,h = width,height
        cells = []
        for y in range(h):
            row = []
            for x in range(w_):
                n,e,s,w = hor_[y][x],ver_[y][x+1],hor_[y+1][x],ver_[y][x]
                c = Cell(e,w,n,s)
                row.append(c)
            cells.append(row)
        return cells
    """for (a, b) in zip(hor, ver):
        print(''.join(a + ['\n'] + b))"""
    cells = {}
    for i,c in enumerate(translateIntoWalls(hor,ver,w,h)):
        row = [ce.arr() for ce in c]
        cells[i] = row

    #check algorithm
    def check_around(x,y,cells):
        arounds = [0,0,0,0]
        w = len(cells[0])
        h = len(cells)
        if x-1 >= 0:
            arounds[3]=[y,x-1]
        if x+1 < w:
            arounds[1]=[y,x+1]
        if y-1 >= 0:
            arounds[0]=[y-1,x]
        if y+1 < h:
            arounds[2]=[y+1,x]
        return arounds
    def righten(cells):


        pass
        w = len(cells[0])
        h = len(cells)
        rules = {0:2,1:3,2:0,3:1}
        for y in range(h):
            for x in range(w):
                ar = check_around(x,y,cells)
                current = cells[y][x]
                for i in range(4):
                    if current[i] == False:
                        if ar[i] != 0:
                            cells[ar[i][0]][ar[i][1]][rules[i]]=False
        return cells
    for i in range(len(cells)):
        cells[i][-1][1] = False
    cells = righten(cells) 
           
    """def search_exits(sp,maze):
        if sp != [0,0]:
            if sp == [w-1,h-1]:
                exits.append(sp)
        if len(visited) == len(maze[0])*len(maze):
            return 
        ars = check_around(sp[0],sp[1],maze)
        currentC = maze[sp[1]][sp[0]]
        currentC = currentC.replace("[","").replace("]","").replace(" ","").split(",")
        currentC = list(map(lambda x: x=="True",currentC)) 

        for i,p in enumerate(ars):
            if p != 0:
                p = p[::-1]
                if p not in visited:
                    
                    if currentC[i] == True:
                        visited.append(p)
                        search_exits(p,maze)
    search_exits([0,0],cells)"""






    
    return_data = {"W":w,"H":h,"cells":cells}
    return return_data
if __name__ == "__main__":
    make_maze()