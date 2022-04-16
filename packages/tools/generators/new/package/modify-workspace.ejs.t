---
sh: cat <%=workspaceFile%> | jqf "pkg => { const path='packages/<%= domain %>/<%= code %>'; const name='<%= domain %>/<%= code %>'; pkg.folders.unshift({ name, path }); return pkg }" | tee <%=workspaceFile%>
---
