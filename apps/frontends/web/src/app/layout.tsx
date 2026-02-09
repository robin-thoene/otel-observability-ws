import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { Slide, ToastContainer } from "react-toastify";

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <ToastContainer
          closeButton={false}
          toastClassName="!bg-white dark:!bg-black border border-black dark:border-white text-red-200 !text-black dark:!text-white"
          closeOnClick
          autoClose={3000}
          transition={Slide}
          hideProgressBar
        />
      </body>
    </html>
  );
}
