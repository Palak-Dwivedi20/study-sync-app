
Steps for registerUser
    1. get user details from frontend
    2. validation
    3. check if user already exists: username, email
    4. create user Object - create entry in db
    5. remove password and refresh token field from response
    6. check for user creation 
    7. return response

Steps for loginUser
    1. retrive data from req body
    2. check username or email available or not 
    3. find the user 
    4. password check 
    5. access and refresh token
    6. send cookie 