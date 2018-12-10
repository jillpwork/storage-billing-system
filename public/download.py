import base64
import requests
def get_as_base64(url):
	print ('data:image/jpeg;base64,', base64.b64encode(requests.get(url).content).decode("utf-8"))

get_as_base64('https://firebasestorage.googleapis.com/v0/b/kaushaldemo-8d55c.appspot.com/o/1539267079793-bg(2).jpg?alt=media&token=4ff3460b-455e-47d6-86e0-d23a38dec565')
