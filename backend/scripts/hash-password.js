import bcrypt from 'bcryptjs';
const pw = process.argv[2];
if (!pw || pw.length < 10) { console.error('Pemakaian: npm run hash-password -- "password-minimal-10-karakter"'); process.exit(1); }
console.log(bcrypt.hashSync(pw, 12));
