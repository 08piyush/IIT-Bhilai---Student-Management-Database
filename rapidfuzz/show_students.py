import json
from rapidfuzz import fuzz
import psycopg2
import sys

sys.stdout.reconfigure(encoding='utf-8')

def allInOne3(keyword, encoding='utf-8'):
    connection = psycopg2.connect(
         user= 'postgres',
        host= 'localhost',
        database= 'studentDB',
        password= 'mdsind1409',
        port= 5432,
    )
    cursor = connection.cursor()

    #  QUERY1 searching in TSVECTOR 
    #  QUERY2 searching with pataa_code till LEVENSHTIEN<=3 
    #  QUERY3 searching only if the keyword is DIGIT 
    #  QUERY4 searching only in records where value is non-numeric e.g. polace , nagar, house 45, 566ADF. / non-examples : 456, 12 etc. , now combined with query5 and metaphone
    #  QUERY5 searching for the values greater than the length of string in address2 and address3
    #  QUERY6 searching in complete data (maybe removed for large databases)
   
    # query1 = "SELECT FIRST_NAME || ' ' || LAST_NAME AS NAME, PATAA_CODE, zipcode, address1, address2, address3, address4, COUNTRY_NAME, STATE_NAME, CITY_NAME, LATI || ',' || LNGI AS GEO_LOCATION FROM PATAA_FTS_DETAILS  WHERE PATAA_VECTOR @@ (PHRASETO_TSQUERY('simple', '{0}' )::text || ':*')::TSQUERY".format(keyword)
    # query2 = "SELECT FIRST_NAME || ' ' || LAST_NAME AS NAME, PATAA_CODE, zipcode, address1, address2, address3, address4, COUNTRY_NAME, STATE_NAME, CITY_NAME, LATI || ',' || LNGI AS GEO_LOCATION FROM PATAA_FTS_DETAILS  WHERE LEVENSHTEIN(pataa_code , '{0}' ) <= 3".format(keyword)
    # query3 = "SELECT FIRST_NAME || ' ' || LAST_NAME AS NAME, PATAA_CODE, zipcode, address1, address2, address3, address4, COUNTRY_NAME, STATE_NAME, CITY_NAME, LATI || ',' || LNGI AS GEO_LOCATION FROM PATAA_FTS_DETAILS WHERE pataa_code LIKE '%{0}%' OR zipcode LIKE '%{0}%' OR address1 LIKE '%{0}%' OR address2 LIKE '%{0}%'".format(keyword)
    # query4 = "SELECT FIRST_NAME || ' ' || LAST_NAME AS NAME, PATAA_CODE, zipcode, address1, address2, address3, address4, COUNTRY_NAME, STATE_NAME, CITY_NAME, LATI || ',' || LNGI AS GEO_LOCATION FROM PATAA_FTS_DETAILS WHERE (address1 ~ '^[^0-9]+$' and LEVENSHTEIN(address1, '{0}') <= 3) or (address2 ~ '^[^0-9]+$' and LEVENSHTEIN(address2, '{0}') <= 3) or (address3 ~ '^[^0-9]+$' and LEVENSHTEIN(address3, '{0}') <= 3) or LEVENSHTEIN(address4, '{0}') <= 3 or LEVENSHTEIN(state_name, '{0}') <= 3 or LEVENSHTEIN(city_name, '{0}') <= 3 or LEVENSHTEIN(country_name, '{0}') <= 3 or metaphone(state_name, 3) = metaphone('{0}', 3) or metaphone(address1, 3) = metaphone('{0}', 3) or metaphone(address2, 3) = metaphone('{0}', 3) or metaphone(address3, 3) = metaphone('{0}', 3) or metaphone(address4, 3) = metaphone('{0}', 3) or (LENGTH(address2) >= LENGTH('{0}')+8 OR (address3 ~ '^[^0-9]+$' and LENGTH(address3) >= LENGTH('{0}')+8 ) OR LENGTH(city_name) >= LENGTH('{0}'))".format(keyword)
    # query5 = "SELECT FIRST_NAME || ' ' || LAST_NAME AS NAME, PATAA_CODE, zipcode, address1, address2, address3, address4, COUNTRY_NAME, STATE_NAME, CITY_NAME, LATI || ',' || LNGI AS GEO_LOCATION FROM PATAA_FTS_DETAILS WHERE LENGTH(address2) >= LENGTH('{0}')+8 OR (address3 ~ '^[^0-9]+$' and LENGTH(address3) >= LENGTH('{0}')+8 ) OR LENGTH(city_name) >= LENGTH('{0}')".format(keyword)
    # query6= "SELECT FIRST_NAME || ' ' || LAST_NAME AS NAME, PATAA_CODE, zipcode, address1, address2, address3, address4, COUNTRY_NAME, STATE_NAME, CITY_NAME, LATI || ',' || LNGI AS GEO_LOCATION FROM PATAA_FTS_DETAILS" 

    # start searching algorithm 


    query1 = "select * from student order by studentid"
    query2 = "select * from student where studentid = '{0}'".format(keyword)

    if(keyword.lower() == 'all' ):
        cursor.execute(query1) 
        rows = cursor.fetchall()
        best_records = []
        for row in rows:
            record = {
                "studentid": row[0],
                "firstname": row[1],
                "lastname": row[2],
                "doj": row[3].isoformat(),
                "contact": row[4],
                "program": row[5],
                "courseids": row[6],
            }
            best_records.append(record)
        
        if(len(rows) > 0):
            return json.dumps(best_records)
        
    else: 
        cursor.execute(query2) 
        rows = cursor.fetchall()
        if(len(rows) > 0):
            return json.dumps(showData(rows))
        
        else: 
                return None 

    cursor.close()
    connection.close()


def calculate_score(keyword, row):
    scores = []
    for value in row:
        if isinstance(value, str):
            terms = [term.strip() for term in value.split() if term.strip()]
            scores.extend([fuzz.token_set_ratio(keyword, term) for term in terms])
    return max(scores) if scores else 0


def showData(rows):
    best_records = []
    for row in rows:
        score = calculate_score(keyword, row)
        if score > 0:
            record = {
                "studentid": row[0],
                "firstname": row[1],
                "lastname": row[2],
                "doj": row[3].isoformat(),
                "contact": row[4],
                "program": row[5],
                "courseids": row[6],
                "score" : score
            }
            best_records.append(record)

    if best_records:
        best_records = sorted(best_records, key=lambda x: x["score"], reverse=True)
        return best_records[:150]
        # return best_records
    else:
        return None

# Retrieve the keyword from command line argument
keyword = str(sys.argv[1])
# keyword = '14'
result = allInOne3(keyword)
print(json.dumps(result))

# release all the data from shell memory
sys.stdout.flush()
