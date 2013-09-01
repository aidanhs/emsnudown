!function(e){function n(e){return" "==e||"\n"==e}function t(e){return/[\x09-\x0d ]/.test(e)}function l(e){return/[A-Za-z0-9]/.test(e)}function r(e){return/[A-Za-z]/.test(e)}function s(e){return/[\x20-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]/.test(e)}function a(e){var n="0123456789ABCDEF"
return"%"+n[(240&e)>>4]+n[(15&e)>>0]}function c(e){var n=e.charCodeAt(0)
if(128>n)return a(n)
if(n>127&&2048>n){var t=a(192|255&n>>6)
return t+=a(128|63&n>>0)}var t=a(224|255&n>>12)
return t+=a(128|63&n>>6),t+=a(128|63&n>>0)}function i(e){var n=["p","dl","div","math","table","ul","del","form","blockquote","figure","ol","fieldset","h1","h6","pre","script","h5","noscript","style","iframe","h4","ins","h3","h2"]
return-1!=n.indexOf(e.toLowerCase())?e.toLowerCase():""}function o(e,n){var l,r=0,s=e.length
if(3>s||"<"!=e[0])return Zt
l=1,"/"==e[l]&&(r=1,l++)
for(var a=0;s>l&&!(a>=n.length);++l,++a)if(e[l]!=n[a])return Zt
return l==s?Zt:t(e[l])||">"==e[l]?r?jt:Yt:Zt}function f(e,n){for(var t,l=0;l<n.s.length;){for(t=l;l<n.s.length&&"\\"!=n.s[l];)l++
if(l>t&&(e.s+=n.s.slice(t,l)),l+1>=n.s.length)break
e.s+=n.s[l+1],l+=2}}function u(e,n,t){for(var l,r=0,s=0;r<n.length;){for(l=r;r<n.length&&!(s=$n[n.charCodeAt(r)]);)r++
if(r>l&&(e.s+=n.slice(l,r)),r>=n.length)break
"/"!=n[r]||t?7==$n[n.charCodeAt(r)]||(e.s+=et[s]):e.s+="/",r++}}function h(e,n){for(var t,l=0;l<n.length;){for(t=l;l<n.length&&0!=nt[n.charCodeAt(l)];)l++
if(l>t&&(e.s+=n.slice(t,l)),l>=n.length)break
if(2!=nt[n.charCodeAt(l)]){switch(n[l]){case"&":e.s+="&amp;"
break
case"'":e.s+="&#x27;"
break
default:e.s+=c(n[l])}l++}else l++}}function k(e,n){var t,l,s=0
for(l=0;n>l;++l)if("<"==e[l]){n=l
break}for(;n>0;)if(-1!="?!.,".indexOf(e[n-1]))n--
else{if(";"!=e[n-1])break
for(var a=n-2;a>0&&r(e[a]);)a--
n-2>a&&"&"==e[a]?n=a:n--}if(0==n)return 0
switch(t=e[n-1]){case'"':s='"'
break
case"'":s="'"
break
case")":s="("
break
case"]":s="["
break
case"}":s="{"}if(0!=s){for(var c=0,i=0,o=0;n>o;)e[o]==s?i++:e[o]==t&&c++,o++
c!=i&&n--}return n}function g(e,n){var t,r=0
if(!l(e[0]))return 0
for(t=1;t<e.length-1;++t)if("."==e[t])r++
else if(!l(e[t])&&"-"!=e[t])break
return n?t:r?t:0}function p(e){var n,t=["http://","https://","ftp://","mailto://","/","git://","steam://","irc://","news://","mumble://","ssh://","ircs://","#"]
for(n=0;n<t.length;++n){var l=t[n].length
if(e.length>l&&0==e.toLowerCase().indexOf(t[n])&&/[A-Za-z0-9#\/?]/.test(e[l]))return 1}return 0}function b(e,n,l,s,a,c){var i,o,f=l.slice(s),u=0
if(4>a||"/"!=l[s+1]||"/"!=l[s+2])return 0
for(;s>u&&r(l[s-u-1]);)u++
if(!p(l.substr(s-u,a+u)))return 0
if(i="://".length,o=g(f.slice(i),c&dt),0==o)return 0
for(i+=o;a>i&&!t(l[s+i]);)i++
return i=k(f,i),0==i?0:(n.s+=l.substr(s-u,i+u),e.p=u,i)}function v(e,n,t,r,s){var a,c=t.slice(r),i=!1
if(3>s)return 0
if(0!=c.indexOf("/r/"))return 0
a="/r/".length,"all-"==c.substr(a-1,4).toLowerCase()&&(i=!0)
do{var o=a,f=24
if(s>=a+10&&"reddit.com"==c.substr(a,10).toLowerCase())a+=10,f=10
else{if(s>a+2&&"t:"==c.substr(a,2)&&(a+=2),!l(c[a]))return 0
a+=1}for(;s>a&&(l(c[a])||"_"==c[a]);)a++
if(2>a-o||a-o>f)return 0}while(s>a&&("+"==c[a]||i&&"-"==c[a])&&a++)
if(s>a&&"/"==c[a])for(;s>a&&(l(c[a])||"_"==c[a]||"/"==c[a]||"-"==c[a]);)a++
return n.s+=c.slice(0,a),e.p=0,a}function _(e,n,t,r,s){var a,c=t.slice(r)
if(6>s)return 0
if(0!=c.indexOf("/u/"))return 0
if(a="/u/".length,!l(c[a])&&"_"!=c[a]&&"-"!=c[a])return 0
for(a+=1;s>a&&(l(c[a])||"_"==c[a]||"/"==c[a]||"-"==c[a]);)a++
return n.s+=c.slice(0,a),e.p=0,a}function d(e,n,t,r,s){var a,c,i=t.slice(r),o=0,f=0
for(c=0;r>c;++c){var u=t[r-c-1]
if(!l(u)&&-1==".+-_".indexOf(u))break}if(0==c)return 0
for(a=0;s>a;++a){var u=t[r+a]
if(!l(u))if("@"==u)o++
else if("."==u&&s-1>a)f++
else if("-"!=u&&"_"!=u)break}return 2>a||1!=o||0==f?0:(a=k(i,a),0==a?0:(n.s+=t.substr(r-c,a+c),e.p=c,a))}function w(e,n,l,r,a){var c,i=l.slice(r)
if(r>0&&!s(l[r-1])&&!t(l[r-1]))return 0
if(4>a||"www."!=i.slice(0,4))return 0
if(c=g(i,0),0==c)return 0
for(;a>c&&!t(i[c]);)c++
return c=k(i,c),0==c?0:(n.s+=i.slice(0,c),e.p=0,c)}function x(e){if(e)for(var n in e)n in this&&(this[n]=e[n])}function S(e,n){this.callbacks=e,this.context=n}function m(e,n){return new S(e,n)}function L(){return{nofollow:0,target:null,tocData:{headerCount:0,currentLevel:0,levelOffset:0},toc_id_prefix:null,html_element_whitelist:$t,html_attr_whitelist:Vt,flags:0,link_attributes:function(e,n,t){t.nofollow&&(e.s+=' rel="nofollow"'),null!=t.target&&(e.s+=' target="'+t.target+'"')}}}function T(e){var n=L()
n.flags=null==e?Jt:e
var t=new S(E(),n)
return t.context.flags&It&&(t.callbacks.image=null),t.context.flags&yt&&(t.callbacks.link=null,t.callbacks.autolink=null),(t.context.flags&Ot||t.context.flags&Xt)&&(t.callbacks.blockhtml=null),t}function C(){var e=L()
e.flags=Nt|Ot
var n=new S(D(),e)
return n}function A(e){return new x(e)}function E(){return new x({blockcode:M,blockquote:O,blockhtml:H,header:I,hrule:y,list:K,listitem:R,paragraph:N,table:P,table_row:B,table_cell:X,autolink:U,codespan:q,double_emphasis:F,emphasis:W,image:z,linebreak:G,link:Z,raw_html_tag:j,triple_emphasis:J,strikethrough:Q,superscript:V,entity:null,normal_text:$,doc_header:null,doc_footer:tn})}function D(){return new x({blockcode:null,blockquote:null,blockhtml:null,header:en,hrule:null,list:null,listitem:null,paragraph:null,table:null,table_row:null,table_cell:null,autolink:null,codespan:q,double_emphasis:F,emphasis:W,image:null,linebreak:null,link:nn,raw_html_tag:null,triple_emphasis:J,strikethrough:Q,superscript:V,entity:null,normal_text:null,doc_header:null,doc_footer:ln})}function M(e,n,l){if(e.s.length&&(e.s+="\n"),l&&l.s.length){var r,s
for(e.s+='<pre><code class="',r=0,s=0;r<l.s.length;++r,++s){for(;r<l.s.length&&t(l.s[r]);)r++
if(r<l.s.length){for(var a=r;r<l.s.length&&!t(l.s[r]);)r++
"."==l.s[a]&&a++,s&&(e.s+=" "),u(e,l.s.slice(a,r),!1)}}e.s+='">'}else e.s+="<pre><code>"
n&&u(e,n.s,!1),e.s+="</code></pre>\n"}function O(e,n){e.s.length&&(e.s+="\n"),e.s+="<blockquote>\n",n&&(e.s+=n.s),e.s+="</blockquote>\n"}function H(e,n){var t,l
if(n){for(l=n.s.length;l>0&&"\n"==n.s[l-1];)l--
for(t=0;l>t&&"\n"==n.s[t];)t++
t>=l||(e.s.length&&(e.s+="\n"),e.s+=n.s.slice(t,l),e.s+="\n")}}function I(e,n,t,l){e.s.length&&(e.s+="\n"),l.flags&Nt?(e.s+="<h"+ +t+' id="',l.toc_id_prefix&&(e.s+=l.toc_id_prefix),e.s+="toc_"+l.tocData.headerCount++ +'">'):e.s+="<h"+ +t+">",n&&(e.s+=n.s),e.s+="</h"+ +t+">\n"}function y(e,n){e.s.length&&(e.s+="\n"),e.s+=n.flags&Bt?"<hr/>\n":"<hr>\n"}function K(e,n,t){e.s.length&&(e.s+="\n"),e.s+=t&lt?"<ol>\n":"<ul>\n",n&&(e.s+=n.s),e.s+=t&lt?"</ol>\n":"</ul>\n"}function R(e,n){if(e.s+="<li>",n){for(var t=n.s.length;t&&"\n"==n.s[t-1];)t--
e.s+=n.s.slice(0,t)}e.s+="</li>\n"}function N(e,n,l){var r=0
if(e.s.length&&(e.s+="\n"),n&&n.s.length){for(;r<n.s.length&&t(n.s[r]);)r++
if(r!=n.s.length){if(e.s+="<p>",l.flags&Pt)for(var s;r<n.s.length;){for(s=r;r<n.s.length&&"\n"!=n.data[r];)r++
if(r>s&&(e.s+=n.s.slice(s,r)),r>=n.s.length-1)break
G(e,l),r++}else e.s+=n.s.slice(r)
e.s+="</p>\n"}}}function P(e,n,t){e.s.length&&(e.s+="\n"),e.s+="<table><thead>\n",n&&(e.s+=n.s),e.s+="</thead><tbody>\n",t&&(e.s+=t.s),e.s+="</tbody></table>\n"}function B(e,n){e.s+="<tr>\n",n&&(e.s+=n.s),e.s+="</tr>\n"}function X(e,n,t){switch(e.s+=t&Gt?"<th":"<td",t&zt){case Wt:e.s+=' align="center">'
break
case qt:e.s+=' align="left">'
break
case Ft:e.s+=' align="right">'
break
default:e.s+=">"}n&&(e.s+=n.s),e.s+=t&Gt?"</th>\n":"</td>\n"}function U(e,n,t,l){var r=0
return n&&n.s.length?0==(l.flags&Rt)||p(n.s)||t==St?(e.s+='<a href="',t==St&&(e.s+="mailto:"),h(e,n.s.slice(r)),l.link_attributes?(e.s+='"',l.link_attributes(e,n,l),e.s+=">"):e.s+='">',0==n.s.indexOf("mailto:")?u(e,n.s.slice(7),!1):u(e,n.s,!1),e.s+="</a>",1):0:0}function q(e,n){return e.s+="<code>",n&&u(e,n.s,!1),e.s+="</code>",1}function F(e,n){return n&&n.s.length?(e.s+="<strong>"+n.s+"</strong>",1):0}function W(e,n){return n&&n.s.length?(e.s+="<em>"+n.s+"</em>",1):0}function z(e,n,t,l,r){return n&&n.s.length?(e.s+='<img src="',h(e,n.s),e.s+='" alt="',l&&l.s.length&&u(e,l.s,!1),t&&t.s.length&&(e.s+='" title="',u(e,t.s,!1)),e.s+=r.flags&Bt?'"/>':'">',1):0}function G(e,n){return e.s+=n.flags&Bt?"<br/>\n":"<br>\n",1}function Z(e,n,t,l,r){return null==n||0==(r.flags&Rt)||p(n.s)?(e.s+='<a href="',n&&n.s.length&&h(e,n.s),t&&t.s.length&&(e.s+='" title="',u(e,t.s,!1)),r.link_attributes?(e.s+='"',r.link_attributes(e,n,r),e.s+=">"):e.s+='">',l&&l.s.length&&(e.s+=l.s),e.s+="</a>",1):0}function Y(e,n,t,l,r,s){var a,c,i,o,f,u=0,h=0,k=new vn
e.s+="<"
var g=1+l.length
if(s==jt&&(e.s+="/",g+=1),e.s+=l,s!=jt)for(;g<n.s.length;g++){switch(f=n.s[g],i=0,o=0,f){case">":h&&!u?(i=1,o=1):o=1
break
case"'":case'"':u?u==f&&(u=!u):u=f
break
default:if(!u)switch(f){case" ":h?(i=1,o=1):o=1
break
case"=":if(h)o=1
else{for(c=0;c<r.length;c++)if(r[c].length==k.s.length){for(a=0;a<k.s.length&&r[c][a].toLowerCase()==k.s[a].toLowerCase();a++);a==k.s.length&&(h=1)}h||(o=1)}}}i&&(e.s+=" "+k.s),o?(h=0,u=0,k.s=""):k.s+=f}e.s+=">"}function j(e,n,t){var l=t.html_element_whitelist
if(0!=(t.flags&Ut)&&l)for(var r=0;l[r];r++){var s=o(n.s,l[r])
if(s!=Zt)return Y(e,n,t,l[r],t.html_attr_whitelist,s),1}return 0!=(t.flags&Xt)?(u(e,n.s,!1),1):0!=(t.flags&Ot)?1:0!=(t.flags&Ht)&&o(n.s,"style")?1:0!=(t.flags&yt)&&o(n.s,"a")?1:0!=(t.flags&It)&&o(n.s,"img")?1:(e.s+=n.s,1)}function J(e,n){return n&&n.s.length?(e.s+="<strong><em>"+n.s+"</em></strong>",1):0}function Q(e,n){return n&&n.s.length?(e.s+="<del>"+n.s+"</del>",1):0}function V(e,n){return n&&n.s.length?(e.s+="<sup>"+n.s+"</sup>",1):0}function $(e,n){n&&u(e,n.s,!1)}function en(e,n,t,l){if(0==l.tocData.currentLevel&&(e.s+='<div class="toc">\n',l.tocData.levelOffset=t-1),t-=l.tocData.levelOffset,t>l.tocData.currentLevel)for(;t>l.tocData.currentLevel;)e.s+="<ul>\n<li>\n",l.tocData.currentLevel++
else if(t<l.tocData.currentLevel){for(e.s+="</li>\n";t<l.tocData.currentLevel;)e.s+="</ul>\n</li>\n",l.tocData.currentLevel--
e.s+="<li>\n"}else e.s+="</li>\n<li>\n"
e.s+='<a href="#',l.toc_id_prefix&&(e.s+=l.toc_id_prefix),e.s+="toc_"+l.tocData.headerCount++ +'">',n&&u(e,n.s,!1),e.s+="</a>\n"}function nn(e,n,t,l){return l&&l.s&&(e.s+=l.s),1}function tn(e,n){n.tocData={headerCount:0,currentLevel:0,levelOffset:0}}function ln(e,n){for(var t=!1;n.tocData.currentLevel>0;)e.s+="</li>\n</ul>\n",n.tocData.currentLevel--,t=!0
t&&(e.s+="</div>\n"),tn(e,n)}function rn(e,t,l,r){var s,a=l.slice(r),c=a.length,i=a[0]
return c>2&&a[1]!=i?"~"==i||n(a[1])||0==(s=Ln(e,t,a,i))?0:s+1:a.length>3&&a[1]==i&&a[2]!=i?n(a[2])||0==(s=Tn(e,t,a,i))?0:s+2:a.length>4&&a[1]==i&&a[2]==i&&a[3]!=i?"~"==i||n(a[3])||0==(s=Cn(e,t,a,i))?0:s+3:0}function sn(e,n,t,l){for(var r,s,a,c,i=t.slice(l),o=0;o<i.length&&"`"==i[o];)o++
for(s=0,r=o;r<i.length&&o>s;r++)"`"==i[r]?s++:s=0
if(o>s&&r>=i.length)return 0
for(a=o;r>a&&" "==i[a];)a++
for(c=r-o;c>o&&" "==i[c-1];)c--
if(c>a){var f=new vn(i.slice(a,c))
n.callbacks.codespan(e,f,n.context)||(r=0)}else n.callbacks.codespan(e,null,n.context)||(r=0)
return r}function an(e,n,t,l){if(t.slice(l),2>l||" "!=t[l-1]||" "!=t[l-2])return 0
for(var r=e.s.length;r&&" "==e.s[r-1];)r--
return e.s=e.s.slice(0,r),n.callbacks.linebreak(e,n.context)?1:0}function cn(e,t,l,r){function s(){return t.spanStack.length=w,S?u:0}var a,c,i=l.slice(r),o=r&&"!"==l[r-1],u=1,h=0,k=0,g=0,p=0,b=null,v=null,_=null,d=null,w=t.spanStack.length,x=0,S=0,m=0,L=0
if(o&&!t.callbacks.image||!o&&!t.callbacks.link)return s()
for(a=1;u<i.length;u++)if("\n"==i[u])x=1
else{if("\\"==i[u-1])continue
if("["==i[u])a++
else if("]"==i[u]&&(a--,0>=a))break}if(u>=i.length)return s()
for(c=u,u++;u<i.length&&n(i[u]);)u++
if(u<i.length&&"("==i[u]){for(u++;u<i.length&&n(i[u]);)u++
for(h=u;u<i.length;)if("\\"==i[u])u+=2
else{if(")"==i[u])break
if(u>=1&&n(i[u-1])&&("'"==i[u]||'"'==i[u]))break
u++}if(u>=i.length)return s()
if(k=u,"'"==i[u]||'"'==i[u]){for(L=i[u],m=1,u++,g=u;u<i.length;)if("\\"==i[u])u+=2
else if(i[u]==L)m=0,u++
else{if(")"==i[u]&&!m)break
u++}if(u>=i.length)return s()
for(p=u-1;p>g&&n(i[p]);)p--
"'"!=i[p]&&'"'!=i[p]&&(g=p=0,k=u)}for(;k>h&&n(i[k-1]);)k--
"<"==i[h]&&h++,">"==i[k-1]&&k--,k>h&&(v=new vn,t.spanStack.push(v),v.s+=i.slice(h,k)),p>g&&(_=new vn,t.spanStack.push(_),_.s+=i.slice(g,p)),u++}else if(u<i.length&&"["==i[u]){var T=new vn,C=null
for(u++,h=u;u<i.length&&"]"!=i[u];)u++
if(u>=i.length)return s()
if(k=u,h==k)if(x){var A=new vn
t.spanStack.push(A)
var E
for(E=1;c>E;E++)"\n"!=i[E]?A.s+=i[E]:" "!=i[E-1]&&(A.s+=" ")
T.s=A.s}else T.s=i.slice(1)
else T.s=i.slice(h,k)
if(C=t.refs[T.s],!C)return s()
v=C.link,_=C.title,u++}else{var T=new vn,C=null
if(x){var A=new vn
t.spanStack.push(A)
var E
for(E=1;c>E;E++)"\n"!=i[E]?A.s+=i[E]:" "!=i[E-1]&&(A.s+=" ")
T.s=A.s}else T.s=i.slice(1,c)
if(C=t.refs[T.s],!C)return s()
v=C.link,_=C.title,u=c+1}return c>1&&(b=new vn,t.spanStack.push(b),o?b.s+=i.slice(1,c):(t.inLinkBody=1,Rn(b,t,i.slice(1,c)),t.inLinkBody=0)),v?(d=new vn,t.spanStack.push(d),f(d,v),o?(e.s.length&&"!"==e.s[e.s.length-1]&&(e.s=e.s.slice(0,-1)),S=t.callbacks.image(e,d,_,b,t.context)):S=t.callbacks.link(e,d,_,b,t.context),s()):s()}function on(e,n,t,l){var r=t.slice(l),s={p:wt},a=Kn(r,s),c=new vn(r.slice(0,a)),i=0
if(a>2)if(n.callbacks.autolink&&s.p!=wt){var o=new vn
n.spanStack.push(o),c.s=r.substr(1,a-2),f(o,c),i=n.callbacks.autolink(e,o,s.p,n.context),n.spanStack.pop()}else n.callbacks.raw_html_tag&&(i=n.callbacks.raw_html_tag(e,c,n.context))
return i?a:0}function fn(e,n,t,l){var r=t.slice(l),s="\\`*_{}[]()#+-.!:|&<>/^~",a=new vn
if(r.length>1){if(-1==s.indexOf(r[1]))return 0
n.callbacks.normal_text?(a.s=r[1],n.callbacks.normal_text(e,a,n.context)):e.s+=r[1]}else 1==r.length&&(e.s+=r[0])
return 2}function un(e,n,t,r){var s=t.slice(r),a=1,c=new vn
for(a<s.length&&"#"==s[a]&&a++;a<s.length&&l(s[a]);)a++
return a<s.length&&";"==s[a]?(a++,n.callbacks.entity?(c.s=s.slice(0,a),n.callbacks.entity(e,c,n.context)):e.s+=s.slice(0,a),a):0}function hn(e,n,t,l){var r,s=t.slice(l),a=null,c={p:null}
return!n.callbacks.autolink||n.inLinkBody?0:(a=new vn,n.spanStack.push(a),(r=b(c,a,t,l,s.length,0))>0&&(c.p>0&&(e.s=e.s.slice(0,-c.p)),n.callbacks.autolink(e,a,xt,n.context)),n.spanStack.pop(),r)}function kn(e,n,t,l){var r,s=t.slice(l),a=null,c={p:null}
return!n.callbacks.autolink||n.inLinkBody?0:(a=new vn,n.spanStack.push(a),(r=d(c,a,t,l,s.length,0))>0&&(c.p>0&&(e.s=e.s.slice(0,-c.p)),n.callbacks.autolink(e,a,St,n.context)),n.spanStack.pop(),r)}function gn(e,n,t,l){var r,s=t.slice(l),a=null,c=null,i=null,o={p:null}
return!n.callbacks.link||n.inLinkBody?0:(a=new vn,n.spanStack.push(a),(r=w(o,a,t,l,s.length,0))>0&&(c=new vn,n.spanStack.push(c),c.s+="http://",c.s+=a.s,o.p>0&&(e.s=e.s.slice(0,e.s.length-o.p)),n.callbacks.normal_text?(i=new vn,n.spanStack.push(i),n.callbacks.normal_text(i,a,n.context),n.callbacks.link(e,c,null,i,n.context),n.spanStack.pop()):n.callbacks.link(e,c,null,a,n.context),n.spanStack.pop()),n.spanStack.pop(),r)}function pn(e,n,t,l){var r,s=t.slice(l),a=null,c={p:null}
return!n.callbacks.autolink||n.inLinkBody?0:(a=new vn,n.spanStack.push(a),(r=v(c,a,t,l,s.length))>0?(c.p>0&&(e.s=e.s.slice(0,-c.p)),n.callbacks.autolink(e,a,xt,n.context)):(r=_(c,a,t,l,s.length))>0&&(c.p>0&&(e.s=e.s.slice(0,-c.p)),n.callbacks.autolink(e,a,xt,n.context)),n.spanStack.pop(),r)}function bn(e,t,l,r){var s,a,c=l.slice(r),i=c.length,o=null
if(!t.callbacks.superscript)return 0
if(2>i)return 0
if("("==c[1]){for(s=a=2;i>a&&")"!=c[a]&&"\\"!=c[a-1];)a++
if(a==i)return 0}else for(s=a=1;i>a&&!n(c[a]);)a++
return 0==a-s?2==s?3:0:(o=new vn,t.spanStack.push(o),Rn(o,t,c.slice(s,a)),t.callbacks.superscript(e,o,t.context),t.spanStack.pop(),2==s?a+1:a)}function vn(e){this.s=e||""}function _n(){this.spanStack=[],this.blockStack=[],this.extensions=mt|Dt|Ct|At|Lt
var e=T()
this.context=e.context,this.callbacks=e.callbacks,this.inLinkBody=0,this.activeChars={},this.refs={},this.nestingLimit=16}function dn(e){var n
for(n=0;n<e.length&&"\n"!=e[n];n++)if(" "!=e[n])return 0
return n+1}function wn(e){var n,t=0,l=0
if(e.length<3)return 0
if(" "==e[0]&&(t++," "==e[1]&&(t++," "==e[2]&&t++)),t+2>=e.length||"*"!=e[t]&&"-"!=e[t]&&"_"!=e[t])return 0
for(n=e[t];t<e.length&&"\n"!=e[t];){if(e[t]==n)l++
else if(" "!=e[t])return 0
t++}return l>=3}function xn(e){var n,t=0,l=0
if(e.length<3)return 0
if(" "==e[0]&&(t++," "==e[1]&&(t++," "==e[2]&&t++)),t+2>=e.length||"~"!=e[t]&&"`"!=e[t])return 0
for(n=e[t];t<e.length&&e[t]==n;)l++,t++
return 3>l?0:t}function Sn(e,t){var l=0,r=0
if(l=xn(e),0==l)return 0
for(;l<e.length&&" "==e[l];)l++
var s
if(s=l,l<e.length&&"{"==e[l]){for(l++,s++;l<e.length&&"}"!=e[l]&&"\n"!=e[l];)r++,l++
if(l==e.length||"}"!=e[l])return 0
for(;r>0&&n(e[s+0]);)s++,r--
for(;r>0&&n(e[s+r-1]);)r--
l++}else for(;l<e.length&&!n(e[l]);)r++,l++
for(t&&(t.s=e.substr(s,r));l<e.length&&"\n"!=e[l];){if(!n(e[l]))return 0
l++}return l+1}function mn(e,n){for(var t=1;t<e.length;){for(;t<e.length&&e[t]!=n&&"`"!=e[t]&&"["!=e[t];)t++
if(t==e.length)return 0
if(e[t]==n)return t
if(t&&"\\"==e[t-1])t++
else if("`"==e[t]){for(var l,r=0,s=0;t<e.length&&"`"==e[t];)t++,r++
if(t>=e.length)return 0
for(l=0;t<e.length&&r>l;)s||e[t]!=n||(s=t),"`"==e[t]?l++:l=0,t++
if(t>=e.length)return s}else if("["==e[t]){var a,s=0
for(t++;t<e.length&&"]"!=e[t];)s||e[t]!=n||(s=t),t++
for(t++;t<e.length&&(" "==e[t]||"\n"==e[t]);)t++
if(t>=e.length)return s
switch(e[t]){case"[":a="]"
break
case"(":a=")"
break
default:if(s)return s
continue}for(t++;t<e.length&&e[t]!=a;)s||e[t]!=n||(s=t),t++
if(t>=e.length)return s
t++}}return 0}function Ln(e,t,l,r){var a,c,i=l.slice(1),o=0
if(!t.callbacks.emphasis)return 0
for(i.length>1&&i[0]==r&&i[1]==r&&(o=1);o<i.length;){if(a=mn(i.slice(o),r),!a)return 0
if(o+=a,o>=i.length)return 0
if(i[o]==r&&!n(i[o-1])){if(t.extensions&mt&&"_"==r&&o+1!=i.length&&!n(i[o+1])&&!s(i[o+1]))continue
var f=new vn
return t.spanStack.push(f),Rn(f,t,i.slice(0,o)),c=t.callbacks.emphasis(e,f,t.context),t.spanStack.pop(),c?o+1:0}}return 0}function Tn(e,t,l,r){var s,a,c=l.slice(2),i=0,o="~"==r?t.callbacks.strikethrough:t.callbacks.double_emphasis
if(!o)return 0
for(;i<c.length;){if(s=mn(c.slice(i),r),!s)return 0
if(i+=s,i+1<c.length&&c[i]==r&&c[i+1]==r&&i&&!n(c[i-1])){var f=new vn
return t.spanStack.push(f),Rn(f,t,c.slice(0,i)),a=o(e,f,t.context),t.spanStack.pop(),a?i+2:0}i++}return 0}function Cn(e,t,l,r){for(var s,a,c=l.slice(3),i=0;i<c.length;){if(s=mn(c.slice(i),r),!s)return 0
if(i+=s,c[i]==r&&!n(c[i-1])){if(i+2<c.length&&c[i+1]==r&&c[i+2]==r&&t.callbacks.triple_emphasis){var o=new vn
return t.spanStack.push(o),Rn(o,t,c.slice(0,i)),a=t.callbacks.triple_emphasis(e,o,t.context),t.spanStack.pop(),a?i+3:0}return i+1<c.length&&c[i+1]==r?(s=Ln(e,t,l,r),s?s-2:0):(s=Tn(e,t,l,r),s?s-1:0)}}return 0}function An(e,n){if("#"!=n[0])return!1
if(e.extensions&Et){for(var t=0;t<n.length&&6>t&&"#"==n[t];)t++
if(t<n.length&&" "!=n[t])return!1}return!0}function En(e){var n=0,t=e.length
if("="==e[n]){for(n=1;t>n&&"="==e[n];n++);for(;t>n&&" "==e[n];)n++
return n>=t||"\n"==e[n]?1:0}if("-"==e[n]){for(n=1;t>n&&"-"==e[n];n++);for(;t>n&&" "==e[n];)n++
return n>=t||"\n"==e[n]?2:0}return 0}function Dn(e){for(var n=e.length,t=0;n>t&&"\n"!=e[t];)t++
return++t>=n?0:En(e.slice(t))}function Mn(e){var n=0,t=e.length
return t>n&&" "==e[n]&&n++,t>n&&" "==e[n]&&n++,t>n&&" "==e[n]&&n++,t>n&&">"==e[n]?t>n+1&&" "==e[n+1]?n+2:n+1:0}function On(e){return e.length>3&&" "==e[0]&&" "==e[1]&&" "==e[2]&&" "==e[3]?4:0}function Hn(e){var n=e.length,t=0
if(n>t&&" "==e[t]&&t++,n>t&&" "==e[t]&&t++,n>t&&" "==e[t]&&t++,t>=n||e[t]<"0"||e[t]>"9")return 0
for(;n>t&&e[t]>="0"&&e[t]<="9";)t++
return t+1>=n||"."!=e[t]||" "!=e[t+1]?0:Dn(e.slice(t))?0:t+2}function In(e){var n=e.length,t=0
return n>t&&" "==e[t]&&t++,n>t&&" "==e[t]&&t++,n>t&&" "==e[t]&&t++,t+1>=n||"*"!=e[t]&&"+"!=e[t]&&"-"!=e[t]||" "!=e[t+1]?0:Dn(e.slice(t))?0:t+2}function yn(e){var n=0,t=0
for(n=0;n<e.length;++n)if(!l(e[n]))switch(e[n]){case"@":t++
case"-":case".":case"_":break
case">":return 1==t?n+1:0
default:return 0}return 0}function Kn(e,n){var t,r
if(e.length<3)return 0
if("<"!=e[0])return 0
if(t="/"==e[1]?2:1,!l(e[t]))return 0
for(n.p=wt;t<e.length&&(l(e[t])||"."==e[t]||"+"==e[t]||"-"==e[t]);)t++
if(t>1&&"@"==e[t]&&0!=(r=yn(e.slice(t))))return n.p=St,t+r
if(t>2&&":"==e[t]&&(n.p=xt,t++),t>=e.length)n.p=wt
else if(n.p){for(r=t;t<e.length;)if("\\"==e[t])t+=2
else{if(">"==e[t]||"'"==e[t]||'"'==e[t]||" "==e[t]||"\n"==e[t])break
t++}if(t>=e.length)return 0
if(t>r&&">"==e[t])return t+1
n.p=wt}for(;t<e.length&&">"!=e[t];)t++
return t>=e.length?0:t+1}function Rn(e,n,t){var l=0,r=0,s=0,a=new vn
if(!(n.spanStack.length+n.blockStack.length>n.nestingLimit))for(;l<t.length;){for(;r<t.length&&!(s=n.activeChars[t[r]]);)r++
if(n.callbacks.normal_text?(a.s=t.slice(l,r),n.callbacks.normal_text(e,a,n.context)):e.s+=t.slice(l,r),r>=t.length)break
l=r,r=tt[s](e,n,t,l),r?(l+=r,r=l):r=l+1}}function Nn(e,n,t){for(var l,r,s,a=0;a<t.length&&6>a&&"#"==t[a];)a++
for(l=a;l<t.length&&" "==t[l];l++);for(r=l;r<t.length&&"\n"!=t[r];r++);for(s=r;r&&"#"==t[r-1];)r--
for(;r&&" "==t[r-1];)r--
if(r>l){var c=new vn
n.spanStack.push(c),Rn(c,n,t.slice(l,r)),n.callbacks.header&&n.callbacks.header(e,c,a,n.context),n.spanStack.pop()}return s}function Pn(e,n,t){var l,r
return e.length+3>=t.length||t.slice(2).toLowerCase()!=e||">"!=t[e.length+2]?0:(l=e.length+3,r=0,l<t.length&&0==(r=dn(t.slice(l)))?0:(l+=r,r=0,l<t.length&&(r=dn(t.slice(l))),l+r))}function Bn(e,n,t,l){var r,s,a=0,c=null,o=new vn(t)
if(t.length<2||"<"!=t[0])return 0
for(r=1;r<t.length&&">"!=t[r]&&" "!=t[r];)r++
if(r<t.length&&(c=i(t.slice(1))),!c){if(t.length>5&&"!"==t[1]&&"-"==t[2]&&"-"==t[3]){for(r=5;r<t.length&&("-"!=t[r-2]||"-"!=t[r-1]||">"!=t[r]);)r++
if(r++,size>r&&(a=dn(t.slice(r))),a)return o.s=t.slice(0,r+a),l&&n.callbacks.blockhtml&&n.callbacks.blockhtml(e,o,n.context),o.s.length}if(t.length>4&&("h"==t[1]||"H"==t[1])&&("r"==t[2]||"R"==t[2])){for(r=3;r<t.length&&">"!=t[r];)r++
if(r+1<t.length&&(r++,a=dn(t.slice(r))))return o.s=t.slice(0,r+a),l&&n.callbacks.blockhtml&&n.callbacks.blockhtml(e,o,n.context),o.s.length}return 0}if(r=1,s=0,"ins"!=c&&"del"!=c){var f=c.length
for(r=1;r<t.length;){for(r++;r<t.length&&("<"!=t[r-1]||"/"!=t[r]);)r++
if(r+2+f>=t.length)break
if(a=Pn(tag,n,t.slice(r-1))){r+=a-1,s=1
break}}}return s?(o.s=o.s.slice(0,r),l&&n.callbacks.blockhtml&&n.callbacks.blockhtml(e,o,n.context),r):0}function Xn(e,n,t){var l,r,s=t.length,a=0,c=0,i="",o=new vn
for(n.blockStack.push(o),l=0;s>l;){for(a=l+1;s>a&&"\n"!=t[a-1];a++);if(r=Mn(t.slice(l,a)))l+=r
else if(dn(t.slice(l,a))&&(a>=s||0==Mn(t.slice(a))&&!dn(t.slice(a))))break
a>l&&(i+=t.slice(l,a),c+=a-l),l=a}return jn(o,n,i),n.callbacks.blockquote&&n.callbacks.blockquote(e,o,n.context),n.blockStack.pop(),a}function Un(e,n,t){for(var r=0,s=0,a=0,c=t.length,i=new vn(t);c>r;){for(s=r+1;c>s&&"\n"!=t[s-1];s++);if(0!=Mn(t.slice(r,s))){s=r
break}var o=t.slice(r)
if(dn(o)||0!=(a=En(o)))break
if(dn(o))break
if(0!=(a=En(o)))break
if(An(n,o)||wn(o)||Mn(o)){s=r
break}if(n.extensions&Mt&&!l(t[r])){if(Hn(o)||In(o)){s=r
break}if("<"==t[r]&&n.callbacks.blockhtml&&Bn(e,n,o,0)){s=r
break}if(0!=(n.extensions&&Tt)&&0!=Sn(o,null)){s=r
break}}r=s}for(var f=r;f&&"\n"==t[f-1];)f--
if(i.s=i.s.slice(0,f),a){var u=null
if(i.size){var h
for(r=i.s.length;f&&"\n"!=t[f];)f-=1
for(h=f+1;f&&"\n"==t[f-1];)f-=1
if(i.s=i.s.slice(0,f),f>0){var k=new vn
n.blockStack.push(k),Rn(k,n,i.s),n.callbacks.paragraph&&n.callbacks.paragraph(e,k,n.context),n.blockStack.pop(),i.s=i.s.slice(h,r)}else i.s=i.s.slice(0,r)}u=new vn,n.spanStack.push(u),Rn(u,n,i.s),n.callbacks.header&&n.callbacks.header(e,u,a,n.context),n.spanStack.pop()}else{var k=new vn
n.blockStack.push(k),Rn(k,n,i.s),n.callbacks.paragraph&&n.callbacks.paragraph(e,k,n.context),n.blockStack.pop()}return s}function qn(e,n,t){var l,r,s=null,a=new vn
if(l=Sn(t,a),0==l)return 0
for(s=new vn,n.blockStack.push(s);l<t.length;){var c,i=new vn
if(c=Sn(t.slice(l),i),0!=c&&0==i.s.length){l+=c
break}for(r=l+1;r<t.length&&"\n"!=t[r-1];r++);if(r>l){var o=t.slice(l,r)
s.s+=dn(o)?"\n":o}l=r}return s.s.length&&"\n"!=s.s[s.s.length-1]&&(s.s+="\n"),n.callbacks.blockcode&&n.callbacks.blockcode(e,s,a.s.length?a:null,n.context),n.blockStack.pop(),l}function Fn(e,n,t){var l,r,s,a=t.length,c=null
for(n.blockStack.push(c=new vn),l=0;a>l;){for(r=l+1;a>r&&"\n"!=t[r-1];r++);if(s=On(t.slice(l,r)))l+=s
else if(!dn(t.slice(l,r)))break
r>l&&(c.s+=dn(t.slice(l,r))?"\n":t.slice(l,r)),l=r}for(var i=c.s.length;i&&"\n"==c.s[i-1];)i-=1
return c.s=c.s.slice(0,i),c.s+="\n",n.callbacks.blockcode&&n.callbacks.blockcode(e,c,null,n.context),n.blockStack.pop(),l}function Wn(e,n,t,l){for(var r,s,a,c=t.length,i=null,o=null,f=0,u=0,h=0,k=0,g=0,p=0;3>h&&c>h&&" "==t[h];)h++
if(f=In(t),f||(f=Hn(t)),!f)return 0
for(r=f;c>r&&"\n"!=t[r-1];)r++
for(n.spanStack.push(i=new vn),n.spanStack.push(o=new vn),i.s+=t.slice(f,r),f=r;c>f;){var b,v
for(r++;c>r&&"\n"!=t[r-1];)r++
if(dn(t.slice(f,r)))k=1,f=r
else{for(a=0;4>a&&r>f+a&&" "==t[f+a];)a++
if(s=a,n.flags&Tt&&0!=Sn(t.slice(f+a,r),null)&&(p=!p),p||(b=In(t.slice(f+a,r)),v=Hn(t.slice(f+a,r))),k&&(l.p&lt&&b||!(l.p&lt)&&v)){l.p|=st
break}if(b&&!wn(t.slice(f+a,r))||v){if(k&&(g=1),s==h)break
u||(u=i.s.length)}else{if(k&&0==s){l.p|=st
break}k&&(i.s+="\n",g=1)}k=0,i.s+=t.slice(f+a,r),f=r}}return g&&(l.p|=rt),l.p&rt?u&&u<i.s.length?(jn(o,n,i.s.slice(0,u)),jn(o,n,i.s.slice(u))):jn(o,n,i.s):u&&u<i.s.length?(Rn(o,n,i.s.slice(0,u)),jn(o,n,i.s.slice(u))):Rn(o,n,i.s),n.callbacks.listitem&&n.callbacks.listitem(e,o,l.p,n.context),n.spanStack.pop(),n.spanStack.pop(),f}function zn(e,n,t,l){var r,s=t.length,a=0,c=null
for(n.blockStack.push(c=new vn);s>a;){var i={p:l}
if(r=Wn(c,n,t.slice(a),i),l=i.p,a+=r,!r||l&st)break}return n.callbacks.list&&n.callbacks.list(e,c,l,n.context),n.blockStack.pop(),a}function Gn(e,t,l,r,s){var a,c=0,i=null
if(t.callbacks.table_cell&&t.callbacks.table_row){for(t.spanStack.push(i=new vn),c<l.length&&"|"==l[c]&&c++,a=0;a<r.length&&c<l.length;++a){var o,f,u
for(t.spanStack.push(u=new vn);c<l.length&&n(l[c]);)c++
for(o=c;c<l.length&&"|"!=l[c];)c++
for(f=c-1;f>o&&n(l[f]);)f--
Rn(u,t,l.slice(o,1+f)),t.callbacks.table_cell(i,u,r[a]|s,t.context),t.spanStack.pop(),c++}for(;a<r.length;++a){var h=null
t.callbacks.table_cell(i,h,r[a]|s,t.context)}t.callbacks.table_row(e,i,t.context),t.spanStack.pop()}}function Zn(e,t,l,r){for(var s,a,c,i=0,o=0;i<l.length&&"\n"!=l[i];)"|"==l[i++]&&o++
if(i==l.length||0==o)return 0
for(a=i;a>0&&n(l[a-1]);)a--
"|"==l[0]&&o--,a&&"|"==l[a-1]&&o--,r.p=Array(o+1)
for(var f=0;f<r.p.length;f++)r.p[f]=0
for(i++,i<l.length&&"|"==l[i]&&i++,c=i;c<l.length&&"\n"!=l[c];)c++
for(s=0;s<r.p.length&&c>i;++s){for(var u=0;c>i&&" "==l[i];)i++
for(":"==l[i]&&(i++,r.p[s]|=qt,u++);c>i&&"-"==l[i];)i++,u++
for(c>i&&":"==l[i]&&(i++,r.p[s]|=Ft,u++);c>i&&" "==l[i];)i++
if(c>i&&"|"!=l[i])break
if(1>u)break
i++}return s<r.p.length?0:(Gn(e,t,l.slice(0,a),r.p,Gt),c+1)}function Yn(e,n,t){var l,r,s,a={p:null}
if(n.spanStack.push(r=new vn),n.blockStack.push(s=new vn),l=Zn(r,n,t,a),l>0){for(;l<t.length;){var c,i=0
for(c=l;l<t.length&&"\n"!=t[l];)"|"==t[l++]&&i++
if(0==i||l==t.length){l=c
break}Gn(s,n,t.slice(c,l),a.p,0),l++}n.callbacks.table&&n.callbacks.table(e,r,s,n.context)}return n.spanStack.pop(),n.blockStack.pop(),l}function jn(e,n,t){var l,r,s,a=0
if(!(n.spanStack.length+n.blockStack.length>n.nestingLimit))for(;a<t.length;)if(s=t.slice(a),l=t.length-a,An(n,s))a+=Nn(e,n,s)
else if("<"==t[a]&&n.callbacks.blockhtml&&0!=(r=Bn(e,n,s,1)))a+=r
else if(0!=(r=dn(s)))a+=r
else if(wn(s)){for(n.callbacks.hrule&&n.callbacks.hrule(e,n.context);a<t.length&&"\n"!=t[a];)a++
a++}else a+=0!=(n.extensions&Tt)&&0!=(r=qn(e,n,s))?r:0!=(n.extensions&Lt)&&0!=(r=Yn(e,n,s))?r:Mn(s)?Xn(e,n,s):On(s)?Fn(e,n,s):In(s)?zn(e,n,s,0):Hn(s)?zn(e,n,s,lt):Un(e,n,s)}function Jn(e,n,t,l){var r,s,a,c,i,o,f,u=0
if(n+3>=t)return 0
if(" "==e[n]&&(u=1," "==e[n+1]&&(u=2," "==e[n+2]&&(u=3," "==e[n+3]))))return 0
if(u+=n,"["!=e[u])return 0
for(u++,r=u;t>u&&"\n"!=e[u]&&"\r"!=e[u]&&"]"!=e[u];)u++
if(u>=t||"]"!=e[u])return 0
if(s=u,u++,u>=t||":"!=e[u])return 0
for(u++;t>u&&" "==e[u];)u++
for(t>u&&("\n"==e[u]||"\r"==e[u])&&(u++,t>u&&"\r"==e[u]&&"\n"==e[u-1]&&u++);t>u&&" "==e[u];)u++
if(u>=t)return 0
for("<"==e[u]&&u++,a=u;t>u&&" "!=e[u]&&"\n"!=e[u]&&"\r"!=e[u];)u++
for(c=">"==e[u-1]?u-1:u;t>u&&" "==e[u];)u++
if(t>u&&"\n"!=e[u]&&"\r"!=e[u]&&"'"!=e[u]&&'"'!=e[u]&&"("!=e[u])return 0
if(f=0,(u>=t||"\r"==e[u]||"\n"==e[u])&&(f=u),t>u+1&&"\n"==e[u]&&"\r"==e[u+1]&&(f=u+1),f)for(u=f+1;t>u&&" "==e[u];)u++
if(i=o=0,t>u+1&&("'"==e[u]||'"'==e[u]||"("==e[u])){for(u++,i=u;t>u&&"\n"!=e[u]&&"\r"!=e[u];)u++
for(o=t>u+1&&"\n"==e[u]&&"\r"==e[u+1]?u+1:u,u-=1;u>i&&" "==e[u];)u-=1
u>i&&("'"==e[u]||'"'==e[u]||")"==e[u])&&(f=o,o=u)}if(!f||c==a)return 0
var h=e.slice(r,s),k=e.slice(a,c),g=null
return o>i&&(g=e.slice(i,o)),l.refs[h]={id:h,link:new vn(k),title:new vn(g)},f}function Qn(e,n){for(var t=0,l=0;t<n.length;){for(var r=t;t<n.length&&"  "!=n[t];)t++,l++
if(t>r&&(e.s+=n.slice(r,t)),t>=n.length)break
do e.s+=" ",l++
while(l%4)
t++}}function Vn(e){var n,t=new vn,l=0
for(this.refs={};l<e.length;)if(n=Jn(e,l,e.length,this))l=n
else{for(n=l;n<e.length&&"\n"!=e[n]&&"\r"!=e[n];)n++
for(n>l&&Qn(t,e.slice(l,n));n<e.length&&("\n"==e[n]||"\r"==e[n]);)("\n"==e[n]||n+1<e.length&&"\n"!=e[n+1])&&(t.s+="\n"),n++
l=n}var r=new vn
return this.callbacks.doc_header&&this.callbacks.doc_header(r,this.context),t.s.length&&("\n"!=t.s[t.s.length-1]&&"\r"!=t.s[t.s.length-1]&&(t.s+="\n"),jn(r,this,t.s)),this.callbacks.doc_footer&&this.callbacks.doc_footer(r,this.context),r.s}var $n=[7,7,7,7,7,7,7,7,7,0,0,7,7,0,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,0,0,1,0,0,0,2,3,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,5,0,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],et=["","&quot;","&amp;","&#39;","&#47;","&lt;","&gt;",""],nt=[2,2,2,2,2,2,2,2,2,0,0,2,2,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,1,0,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
x.prototype={blockcode:null,blockquote:null,blockhtml:null,header:null,hrule:null,list:null,listitem:null,paragraph:null,table:null,table_row:null,table_cell:null,autolink:null,codespan:null,double_emphasis:null,emphasis:null,image:null,linebreak:null,link:null,raw_html_tag:null,triple_emphasis:null,strikethrough:null,superscript:null,entity:null,normal_text:null,doc_header:null,doc_footer:null},e.createCustomRenderer=m,e.defaultRenderState=L,e.getRedditRenderer=T,e.getTocRenderer=C,e.createCustomCallbacks=A,e.getRedditCallbacks=E,e.getTocCallbacks=D
var tt=[null,rn,sn,an,cn,on,fn,un,hn,kn,gn,pn,bn],lt=1,rt=2,st=8,at=0
at++
var ct=at++,it=at++,ot=at++,ft=at++,ut=at++,ht=at++,kt=at++,gt=at++,pt=at++,bt=at++,vt=at++,_t=at++,dt=1
at=0
var wt=at++,xt=at++,St=at++,mt=1,Lt=2,Tt=4,Ct=8,At=16,Et=64,Dt=128,Mt=256,Ot=1,Ht=2,It=4,yt=8,Kt=16,Rt=32,Nt=64,Pt=128,Bt=256,Xt=512,Ut=1024,qt=1,Ft=2,Wt=3,zt=3,Gt=4,Zt=0,Yt=1,jt=2
_n.prototype.render=Vn,e.getParser=function(e,n,t){var l=new _n
e&&(l.callbacks=e.callbacks),t&&(l.nestingLimit=t),e&&(l.context=e.context),void 0!=n&&null!=n&&(l.extensions=n)
var r=l.callbacks
return(r.emphasis||r.double_emphasis||r.triple_emphasis)&&(l.activeChars["*"]=ct,l.activeChars._=ct,l.extensions&At&&(l.activeChars["~"]=ct)),r.codespan&&(l.activeChars["`"]=it),r.linebreak&&(l.activeChars["\n"]=ot),(r.image||r.link)&&(l.activeChars["["]=ft),l.activeChars["<"]=ut,l.activeChars["\\"]=ht,l.activeChars["&"]=kt,l.extensions&Ct&&(l.activeChars[":"]=gt,l.activeChars["@"]=pt,l.activeChars.w=bt,l.activeChars["/"]=vt),l.extensions&Dt&&(l.activeChars["^"]=_t),l}
var Jt=Ot|It|Rt|Xt|Bt,Qt=Ot|Rt|Ut|Xt|Bt,Vt=["colspan","rowspan","cellspacing","cellpadding","scope"],$t=["tr","th","td","table","tbody","thead","tfoot","caption"]
e.DEFAULT_HTML_ELEMENT_WHITELIST=$t,e.DEFAULT_HTML_ATTR_WHITELIST=Vt,e.DEFAULT_BODY_FLAGS=Jt,e.DEFAULT_WIKI_FLAGS=Qt,e.HTML_SKIP_HTML=Ot,e.HTML_SKIP_STYLE=Ht,e.HTML_SKIP_IMAGES=It,e.HTML_SKIP_LINKS=yt,e.HTML_EXPAND_TABS=Kt,e.HTML_SAFELINK=Rt,e.HTML_TOC=Nt,e.HTML_HARD_WRAP=Pt,e.HTML_USE_XHTML=Bt,e.HTML_ESCAPE=Xt,e.HTML_ALLOW_ELEMENT_WHITELIST=Ut,e.MKDEXT_NO_INTRA_EMPHASIS=mt,e.MKDEXT_TABLES=Lt,e.MKDEXT_FENCED_CODE=Tt,e.MKDEXT_AUTOLINK=Ct,e.MKDEXT_STRIKETHROUGH=At,e.MKDEXT_SPACE_HEADERS=Et,e.MKDEXT_SUPERSCRIPT=Dt,e.MKDEXT_LAX_SPACING=Mt,e.SD_AUTOLINK_SHORT_DOMAINS=dt,e.MKDA_NOT_AUTOLINK=wt,e.MKDA_NORMAL=xt,e.MKDA_EMAIL=St,"function"==typeof define&&define("snuownd",[],e)}("undefined"!=typeof exports?exports:"undefined"!=typeof window?window.SnuOwnd={}:{})

