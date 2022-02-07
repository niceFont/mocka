interface LayoutProps {
  children: React.ReactNode;
}

function Navbar({ children }: LayoutProps) {

  return (
    <>
      <header>
        <nav className="flex justify-between text-slate-700 p-4">
          <h1 className="font-bold text-2xl tracking-tight ">Mocka</h1>
        </nav>
      </header>
      <main style={{ marginTop: "100px" }} className="flex justify-center items-center">
        <div className="p-8 w-3/4 rounded-lg shadow-md bg-white  border-gray-100 border-2">
          {children}
        </div>
      </main>
    </>
  )
}


export default Navbar;