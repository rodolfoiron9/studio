
"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Bot, User, Loader, Send, Scan } from "lucide-react";
import { runDataAgent } from "@/app/actions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type Message = {
    role: 'user' | 'assistant';
    content: string;
}

export default function DatabasePage() {
    const { toast } = useToast();
    const [query, setQuery] = useState("");
    const [conversation, setConversation] = useState<Message[]>([]);
    const [isPending, startTransition] = useTransition();
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const submitQuery = (queryString: string) => {
        if (!queryString.trim() || isPending) return;

        const userMessage: Message = { role: 'user', content: queryString };
        setConversation(prev => [...prev, userMessage]);
        setQuery("");

        startTransition(async () => {
            const result = await runDataAgent(queryString);
            if (result.success && result.data?.response) {
                const assistantMessage: Message = { role: 'assistant', content: result.data.response };
                setConversation(prev => [...prev, assistantMessage]);
            } else {
                toast({ variant: 'destructive', title: "Error", description: result.error });
                // Remove the user message if the agent fails
                setConversation(prev => prev.slice(0, prev.length - 1));
            }
        });
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        submitQuery(query);
    };

    const handleScanProject = () => {
        const scanQuery = "Please scan the project and create a new knowledge base from the findings.";
        submitQuery(scanQuery);
    }

    useEffect(() => {
        if (scrollAreaRef.current) {
            const scrollElement = scrollAreaRef.current.querySelector('div');
             if (scrollElement) {
                scrollElement.parentElement?.scrollTo({
                    top: scrollElement.scrollHeight,
                    behavior: 'smooth',
                });
            }
        }
    }, [conversation]);
    
    return (
        <div className="p-4 md:p-8 h-[calc(100vh-4rem)] flex flex-col">
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-headline">AI Data Agent</h1>
                <p className="text-muted-foreground">Ask questions about your project's data in natural language.</p>
            </div>
            
            <Card className="flex-grow flex flex-col">
                <CardHeader className="flex flex-row justify-between items-start">
                    <div>
                        <CardTitle className="flex items-center gap-2"><Bot /> Conversation</CardTitle>
                        <CardDescription>Ask a question like: &quot;How many tracks are in the album?&quot; or click Scan Project.</CardDescription>
                    </div>
                    <Button variant="outline" onClick={handleScanProject} disabled={isPending}>
                        <Scan className="mr-2 h-4 w-4"/>
                        Scan Project & Build Knowledge
                    </Button>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col gap-4">
                    <ScrollArea className="flex-grow pr-4" ref={scrollAreaRef}>
                        <div className="space-y-6">
                            {conversation.map((message, index) => (
                                <div key={index} className={cn("flex items-start gap-4", message.role === 'user' ? "justify-end" : "justify-start")}>
                                   {message.role === 'assistant' && (
                                       <Avatar className="w-8 h-8 border">
                                           <AvatarFallback><Bot size={20}/></AvatarFallback>
                                       </Avatar>
                                   )}
                                   <div className={cn(
                                       "max-w-prose p-3 rounded-lg", 
                                       message.role === 'user' ? "bg-primary text-primary-foreground" : "bg-muted"
                                    )}>
                                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                   </div>
                                    {message.role === 'user' && (
                                       <Avatar className="w-8 h-8 border">
                                           <AvatarFallback><User size={20} /></AvatarFallback>
                                       </Avatar>
                                   )}
                                </div>
                            ))}
                             {isPending && (
                                <div className="flex items-start gap-4 justify-start">
                                    <Avatar className="w-8 h-8 border">
                                        <AvatarFallback><Bot size={20} /></AvatarFallback>
                                    </Avatar>
                                    <div className="max-w-prose p-3 rounded-lg bg-muted flex items-center gap-2">
                                        <Loader className="h-4 w-4 animate-spin"/>
                                        <p className="text-sm">Thinking...</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                    <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t pt-4">
                        <Input 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ask the AI about your data..."
                            disabled={isPending}
                            className="flex-grow"
                        />
                        <Button type="submit" size="icon" disabled={isPending || !query.trim()}>
                           {isPending ? <Loader className="animate-spin" /> : <Send />}
                           <span className="sr-only">Send</span>
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
