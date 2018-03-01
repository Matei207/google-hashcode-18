mkdir -p submission

node index.js ./datasets/a_example.in ./submission/a.txt
node index.js ./datasets/b_should_be_easy.in ./submission/b.txt
node index.js ./datasets/c_no_hurry.in ./submission/c.txt
node index.js ./datasets/d_metropolis.in ./submission/d.txt
node index.js ./datasets/e_high_bonus.in ./submission/e.txt

zip ./submission/sources.zip package.json index.js -v
