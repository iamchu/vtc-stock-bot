import os
import requests
import bs4

def main():
	list_of_company_codes = returnCompanyCodesAsList()

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
main()