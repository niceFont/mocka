import { PropsWithChildren } from 'react';

function Navbar({ children }: PropsWithChildren<any>) {
  return (
    <>
      <header className="flex justify-center">
        <nav className="flex justify-between max-w-[1200px] min-w-[1200px]  text-white p-4">
          <h1 className="font-bold text-4xl tracking-tight ">Mocka</h1>
        </nav>
      </header>
      <main style={{ marginTop: '150px' }} className="flex justify-center items-center">
        <div className="p-8 w-3/4 mb-20 max-w-[1000px] rounded-lg shadow-lg bg-white  border-gray-100 border-2">
          {children}
        </div>
      </main>
    </>
  );
}

export default Navbar;
