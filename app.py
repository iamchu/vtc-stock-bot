import os
import requests
import bs4
import sqlite3 as lite
import sys

def scrapeStockQuotations():
	pass

def saveDataIntoDatabase():
	pass

def handleLogicalRequests():
	pass

# grab BOVESPA company codes
def returnCompanyCodesAsList():
	url = 'https://cotacoes.economia.uol.com.br/acoes-bovespa.html?exchangeCode=.BVSP&page=1&size=3000'
	list_of_company_codes = []
	total_of_companies = 0

	page = requests.get(url)
	page.raise_for_status()

	cotacoes_soup = bs4.BeautifulSoup(page.text, "lxml")
	bs4_company_codes = cotacoes_soup.find_all(class_ = "clear-box")

	for line in bs4_company_codes:
		this_company_code_soup = bs4.BeautifulSoup(str(line), "lxml")
		if len(this_company_code_soup.find_all('span')) > 1:
			# print this_company_code_soup.find_all('span')[1].get_text()
			list_of_company_codes.append(this_company_code_soup.find_all('span')[1].get_text())
			total_of_companies+=1

	print 'Total of ' + str(total_of_companies) + ' companies listed in BOVESPA (Note that some may be deprecated)'
	return list_of_company_codes


# creates a respective table for the respective company in the db passed as argument
def tableConstructor(db, table_name):
	con = lite.connect('test.db')

	# with con:
	    
	#     cur = con.cursor()    
	#     cur.execute("CREATE TABLE Cars(Id INT, Name TEXT, Price INT)")
	#     cur.execute("INSERT INTO Cars VALUES(1,'Audi',52642)")
	#     cur.execute("INSERT INTO Cars VALUES(2,'Mercedes',57127)")
	#     cur.execute("INSERT INTO Cars VALUES(3,'Skoda',9000)")
	#     cur.execute("INSERT INTO Cars VALUES(4,'Volvo',29000)")
	#     cur.execute("INSERT INTO Cars VALUES(5,'Bentley',350000)")
	#     cur.execute("INSERT INTO Cars VALUES(6,'Citroen',21000)")
	#     cur.execute("INSERT INTO Cars VALUES(7,'Hummer',41400)")
	#     cur.execute("INSERT INTO Cars VALUES(8,'Volkswagen',21600)")

def insertStockDataIntoTable(data, cotacao, minima, maxima, variacao, variacao_porcentagem, volume, table):
	pass

# populate db with data from url passed as argument
def scrapeCompanyQuotations(url_suffix):
	url = 'https://cotacoes.economia.uol.com.br/acao/cotacoes-historicas.html?codigo=' + url_suffix + '&beginDay=1&beginMonth=1&beginYear=2004&endDay=1&endMonth=1&endYear=2018&page=1&size=10000'

	page = requests.get(url)
	page.raise_for_status()
	# grab the lines as items on a list
	# go through each of the items and break in a sublist and grab the corresponding items accordingly

	soup = bs4.BeautifulSoup(page.text, "lxml")

	lines = soup.find_all("tr")

	for line in lines:
		print line
		print "-------"*20


def main():
	list_of_company_codes = returnCompanyCodesAsList()
	scrapeCompanyQuotations("ITUB4.SA")

main()