import psycopg2
import pandas as pd

'''
connection info
'''
user = "wjflathm"
pswd = "ZSHTq78hOxIm"
db = "neondb"
host = "ep-plain-hall-749928.us-east-2.aws.neon.tech"
class importExport:
    def __init__(self):
        self.connection = psycopg2.connect(user=user,
                                           password = pswd,
                                           database = db,
                                           host = host)
        self.cur = self.connection.cursor()

    def reload_cursor(self):
        self.cur.close()
        self.cur = self.connection.cursor()

    def reload_connection(self):
        self.cur.close()
        self.connection.close()
        self.connection = psycopg2.connect(user=user,
                                           password = pswd,
                                           database = db,
                                           host = host)
        self.cur = self.connection.cursor()
    #gets a list of tables in the db
    def get_tables(self) -> list:
        self.cur.execute("""SELECT table_name FROM information_schema.tables
       WHERE table_schema = 'public'""")
        tables=[i[0] for i in self.cur.fetchall()]
        return tables

    #gets the columns in a table in the db as a list
    def get_columns(self, table: str)->list:
        if table not in self.get_tables():
            return []

        self.cur.execute("SELECT * FROM %s LIMIT 0" % table)
        ans = self.cur.description
        return [i.name for i in ans]

    #gets the columns in a table in the db as a string tuple
    def get_columns_string(self, table: str)->str:
        if table not in self.get_tables():
            return []
        query = "SELECT * FROM %s LIMIT 0" % table
        self.cur.execute(query)
        ans = self.cur.description
        return str(tuple([i.name for i in ans])).replace("'","")

    #insert into db, return true if successful, return false if cant & maybe throw some
    #problem
    def insert_into_db(self, table: str, obj : str) -> bool:
        #check if table exists
        if table not in self.get_tables():
            return False
        column_string = self.get_columns_string(table)
        insert_query = f"""INSERT INTO {table} {column_string} VALUES {obj} """
        try:
            self.cur.execute(insert_query)

            self.connection.commit()
        except psycopg2.errors.UniqueViolation:
            return False
        return True

    def import_rules(self,csv_path: str, table: str, vulndb_rule:bool = False, buckets_table_name = 'buckets') -> bool:
        df = pd.read_csv(csv_path)
        self.reload_connection()
        
        columns = self.get_columns(table)
        
        db_entries=[]
        for i in df.index:
            
            entry = []
            for column in columns:
                
                if df[column][i] != "nan":
                        
                    entry.append(df[column][i])
                else:
                    entry.append("")
            
            worked = self.insert_into_db(table, str(tuple(entry)).replace("nan","''"))
            
            if vulndb_rule == True and worked:
                bucket = df['buckets'][i].strip('{').strip('}')
                get_bucket_query = f"SELECT * from public.{buckets_table_name} WHERE name = '{bucket}'"
                self.reload_cursor()
                self.cur.execute(get_bucket_query)
                x = list(self.cur.fetchone())
                bucket_id = x[0]
                cols = "(rule_id, bucket_id)"
                ids = "(" + str(df["id"][i]) + "," + str(bucket_id) + ")"
                
                insert_into_relation = f"INSERT INTO rule_bucket {cols} VALUES {ids}"
                #update_query = f"UPDATE public.{buckets_table_name} SET rules = '{x[-1]}' WHERE name = '{bucket}'"
               # print(update_query)
                self.cur.execute(insert_into_relation)
                self.connection.commit()


    def export_rules(self, export_path: str, table_to_export: str) -> bool:
        self.cur.execute("SELECT * FROM public.%s" % table_to_export)
        data = self.cur.fetchall()
        print(tuple(data))
        df = pd.DataFrame(data, columns = self.get_columns(table_to_export))
        df.to_csv(export_path)
