# Airbnb

###DIrectory Structure :

```
AirBnb:
	|- routes:		
		|- users: (user specific api)
			|- user.filename.js
			|- user.filename1.js		
		|- host: (host specific api)
			|- host.filename.js
			|- host.filename1.js		
		|-admin: (admin specifc api)
			|- admin.filename.js
			|- admin.filename1.js		
		|-utils: (all utilities like database connectivites, crons etc.)
			|- utils.filename.js
			|- utils.filename1.js
	|- public:      (For stylesheet, templates and scripts, keep the name of the file same. Like home, let's just use prefix and extesion to identify the type)
		|- stylesheet:
				|- style.home.css
				|- style.user.css		
		|- templates:
				|- view.home.html
				|- view.user.html		
		|- scripts:
				|- controller.home.js
				|- controller.user.js		
		|- images:
				|- <images_name>.png/jpg		
		|- libabries:(mostly CDN will be used, incase required)
				|- <library.js>
	|- view:
		|- index.js
		|- user.js
	|- app.js	
	|- package.json
  ```

Execute the following SQL scripts to cretae the table. Also update the utils.mysql.pool and utils.mysql.js scripts to use the database that you have on your system. Currently it is StartTest for test purpose only.
```
CREATE TABLE BOOKED_PROPERTIES(prop_id VARCHAR(12), user_id VARCHAR(12), host_id VARCHAR(12), from_date DATE, till_date DATE, approved TINYINT, id int PRIMARY KEY AUTO_INCREMENT, price int, city VARCHAR(24));

CREATE TABLE AVAILABLE_DATES(prop_id VARCHAR(12), from_date DATE, till_date DATE, id INT PRIMARY KEY AUTO_INCREMENT);```

