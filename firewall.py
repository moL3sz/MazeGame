class Point:
    def __init__(self,x,y):
        self.x = x
        self.y = y
    def sum_(self,x,y):
        return x+y


class Vector(Point):
    def __init__(self):
        self.p = Point(10,15)
        self.v = self.p.sum_(self.p.x,self.p.y)
        print(self.v)

v = Vector()

