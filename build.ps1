vite build
move dist frontend

if (test-path ../qtbuild/frontend) {
	del -force ../qtbuild/frontend
}

move frontend ../qtbuild -force
