# from twilio.rest import Client 
 
# account_sid = 'AC70058f8b7f968199f26051c144f61105' 
# auth_token = 'b8f0cf0d33b1a250f97e98284e91a5bc' 
# client = Client(account_sid, auth_token) 
 
# message = client.messages.create( 
#                               from_='whatsapp:+14155238886',  
#                               body='Your project is almost done!',      
#                               to='whatsapp:+918879027006' 
# ) 
 
# print(message.sid)
data = {'message':'l'}

print("Drink water!\n" + data['message'])