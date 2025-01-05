export const ChatEmpty = ({ message }: { message: string }) => {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
};