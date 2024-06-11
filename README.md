# quipuTest
To run the tests you need to first clone the repo to your local machine with:
`git clone https://github.com/Marija0206/quipuTest.git`

After cloning the project run following commands:
1. npm install
2. `npx playwright test` - to run the tests in the background
3. `npx playwright test --ui` - to run the tests with ui enabled
4. `npx playwright show-report` - to see html reports


Note #1: Parallel execution of the tests is set to false because all of the tests depend on the first one for creating account
Note #2: If running the tests couple of times please change the second email in `EMAILS` array
Note #3: Total time spent for the whole challenge ~6h
