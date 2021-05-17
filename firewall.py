from datetime import date,datetime
import sqlite3
class HandleFeedbackRequests:
    def __init__(self):
        self.request_ips = {}
        self.keep_req_days_limit = 2;
    
    def add_req(self,ip):
        if ip not in self.request_ips:
            current_date = date.today()
            self.request_ips[ip] = (1,current_date)
        else:
            if self.request_ips[ip][0] < 10:
                self.request_ips[ip][0]+=1;
                self.request_ips[ip][1] = date.today()
    def del_req(self):
        for ip,prop in zip(self.request_ips.keys(),self.request_ips.values()):
            if (prop[1]-date.today()).days > self.keep_req_days_limit:
                del self.request_ips[ip]
                print("[*] Deleted request")

            





        pass




        
    
