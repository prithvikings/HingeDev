authRouter
-Post /signup
-Post /login
-Post /logout

profileRouter
-GET /profile/view
-PATCH /profile/edit
-PATCH /profile/password

connectionRequestRouter
//Status-ignore,interested,accepted,rejected
-POST /request/send/interested/:userID
-POST /request/send/ignored/:userID
-POST /request/review/accepted/:userID
-POST /request/review/rejected/:userID


-GET /user/connections
-GET /requests/recieved
-GET /feed -get you the profile of others user on platform