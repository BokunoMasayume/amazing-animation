export default function times(n,f){
  for (let i = 0; i < n; i++) {
    f.call(this,i);
  }
}
/*
*多次调用某函数作为方法
*/