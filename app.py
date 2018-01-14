# BUGS!!!
# ESSA PORRA TA SUBTRAINDO QUANDO ENFIA A DATA NA TABLE PORRA!
# PRA RESOLVER ISSO, TENHO Q USAR O EXECUTEMANY!!!! 

import os
import requests
import bs4
import sqlite3 as lite
import sys

# grab BOVESPA company codes
def returnCompanyCodesAsList():
	url = 'https://cotacoes.economia.uol.com.br/acoes-bovespa.html?exchangeCode=.BVSP&page=1&size=3000'
	# url = 'file:///home/gojiras/Documents/vtc-stock-bot/VIVR3_SA.html'
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


# creates a table for the respective company in the db passed as argument
def createTable(db, table_name):
	con = lite.connect(db)
	table_name = table_name.replace(".", "_")
	with con:
		cur = con.cursor()
		sqlite_command_create = "CREATE TABLE "+ table_name +"(id INT, date TEXT, cotacao REAL, minima REAL, maxima REAL, variacao REAL, variacao_porcentagem REAL, volume INT)"
		# WHEN OUT OF BETA, REMOVE THIS COMMAND, OTHERWISE THE DB WILL ALWAYS BE DROPPED!!! TODO
		sqlite_command_drop = "DROP TABLE IF EXISTS "+ table_name
		cur.execute(sqlite_command_drop)
		cur.execute(sqlite_command_create)
		print 'TABLE ' + table_name + ' CREATED'
	if con:
		con.close()

# argument is one list with the 7 values we need for the company data
def insertIntoTable(connection_to_db,list_of_lists_with_data, table_name):
	# con = lite.connect(db)
	# table_name = table_name.replace(".", "_")
	with connection_to_db: 
		cur = connection_to_db.cursor()
		sqlite_command_insert = "INSERT INTO " + table_name + " VALUES(?,?,?,?,?,?,?,?)" 
		# cur.executemany("INSERT INTO VIVR3_SA VALUES(?,?,?,?,?,?,?,?)" , list_of_lists_with_data)
		cur.executemany(sqlite_command_insert, list_of_lists_with_data)

def scrapeCompanyQuotationsAndReturnAsListOfLists(company_code):
	url = 'https://cotacoes.economia.uol.com.br/acao/cotacoes-historicas.html?codigo=' + company_code + '&beginDay=1&beginMonth=1&beginYear=2004&endDay=1&endMonth=1&endYear=2018&page=1&size=10000'

	page = requests.get(url)
	page.raise_for_status()
	# grab the lines as items on a list
	# go through each of the items and break in a sublist and grab the corresponding items accordingly

	soup = bs4.BeautifulSoup(page.text, "lxml")
	tblInterday = soup.find(id="tblInterday")	
	soup = bs4.BeautifulSoup(str(tblInterday), "lxml")	

	lines = soup.find_all("tr")
	company_historical_data = []

	# Here the range starts at 1 because the tblInterday has headers
	line_id = 0
	for i in range(1,len(lines)):
		line_id+=1
		# holds the data for one line of the historical quotations table. This is so we can append to the company_historical_data
		current_line_historical_data = []
		line_soup = bs4.BeautifulSoup(str(lines[i]), "lxml")
		line_values = line_soup.find_all("td")
		current_line_historical_data.append(line_id)
		for j in range(len(line_values)):
			if j < 6:
				current_line_historical_data.append(line_values[j].get_text().replace(",", "."))
		# isso pq o ultimo campo da tabela la do site tem . que precisa ser trocado por 'vazio' pq nao eh decimal, mas sim separador de mil, milhao, etc
			else:
				current_line_historical_data.append(line_values[j].get_text().replace(".", ""))
		company_historical_data.append(current_line_historical_data)

	return company_historical_data

def main():
	list_of_company_codes = returnCompanyCodesAsList()
	data = scrapeCompanyQuotationsAndReturnAsListOfLists("VIVR3.SA")
	for i in range(10):
		print data[i]
	# for line in data:
	# 	if len(line) > 7:
	# 		print line

	# test_list = ["VIVR3.SA","ITUB4.SA","ACNB34.SA"]
	test_list = ["VIVR3.SA","ITUB4.SA","ACNB34.SA"]

	for company in list_of_company_codes:
		total_entries = 0
		createTable('stock_data.db', company)
		data = scrapeCompanyQuotationsAndReturnAsListOfLists(company)
		con = lite.connect('stock_data.db')
		insertIntoTable(con, data, company.replace(".", "_"))
		total_entries+=1
		print len(data)
		print "Total entries: " + str(len(data))
		print "Sucessfully created and inserted data into table " + company

main()

# todo now:
# 1) save the data from the tables to a table in the correct database.

# TA DANDO ERRO DO 12 VALUES WERE SUPPLIED POR CAUSA DAS BARRAS E DOS PONTOS NOS NUMEROS INSERIDOS! A TABELA PRECISA DE , PRA FLOAT E ACHO Q BARRAS TALVES SEJAM PROBLEMATICAS (?)
# PODE ESTAR MUITO DEVAGAR PORQUE ESTOU FECHANDO E ABRINDO A CONEXAO TODA VEZ!!!
# MAYBE ITS BETTER TO DO BULK INSERTS (MAYBE FASTER????)