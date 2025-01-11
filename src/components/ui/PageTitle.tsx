const PageTitle = ({ children }: { children: React.ReactNode }) => {
    return (
        <h1 className="m-4 mt-8 text-2xl">
            {children}
        </h1>
    );
};

export default PageTitle;