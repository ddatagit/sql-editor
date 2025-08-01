import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Play, 
  Save, 
  Code, 
  Database, 
  Table, 
  FileText,
  Users,
  Download,
  Share2,
  Settings,
  Plus,
  Search,
  MessageCircle,
  Send,
  Clock,
  User,
  Moon,
  Sun,
  Code2,
  Building2,
  Link,
  Check,
  History,
  GitBranch,
  Edit3,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Bell,
  Shield,
  Palette,
  Monitor,
  Circle
} from "lucide-react";

const SQLEditor = () => {
  const { toast } = useToast();
  const [sqlQuery, setSqlQuery] = useState(`-- Advanced SQL Editor with Monaco
-- Features: Syntax highlighting, auto-completion, formatting

SELECT 
    e.first_name,
    e.last_name,
    e.department,
    e.salary,
    d.budget as department_budget
FROM employees e
LEFT JOIN departments d ON e.department = d.name
WHERE e.salary > 75000
ORDER BY e.salary DESC;`);

  const [showComments, setShowComments] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showAddStatementDialog, setShowAddStatementDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [queryTitle, setQueryTitle] = useState("");
  const [queryDescription, setQueryDescription] = useState("");
  const [newComment, setNewComment] = useState("");
  const [queryRunning, setQueryRunning] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [businessMode, setBusinessMode] = useState(false);
  const [savedStatements, setSavedStatements] = useState([]);
  const [showVersionDialog, setShowVersionDialog] = useState(false);
  const [showCollaborateDialog, setShowCollaborateDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [queryResults, setQueryResults] = useState(null);
  const [queryError, setQueryError] = useState(null);
  const [selectedStatement, setSelectedStatement] = useState(null);

  // Active collaborators
  const [activeUsers] = useState([
    { id: 1, name: "John Doe", avatar: "JD", status: "online", lastSeen: "now" },
    { id: 2, name: "Jane Smith", avatar: "JS", status: "online", lastSeen: "2 min ago" },
    { id: 3, name: "Bob Wilson", avatar: "BW", status: "away", lastSeen: "10 min ago" },
  ]);

  // Version history mock data
  const [versionHistory] = useState([
    {
      id: 1,
      version: "v1.3",
      author: "John Doe",
      timestamp: "2024-01-15 14:30",
      changes: "Added ORDER BY clause and optimized JOIN",
      query: "SELECT e.first_name, e.last_name FROM employees e ORDER BY e.salary DESC;"
    },
    {
      id: 2,
      version: "v1.2",
      author: "Jane Smith", 
      timestamp: "2024-01-15 10:15",
      changes: "Updated WHERE condition for salary threshold",
      query: "SELECT e.first_name, e.last_name FROM employees e WHERE e.salary > 70000;"
    },
    {
      id: 3,
      version: "v1.1",
      author: "Current User",
      timestamp: "2024-01-14 16:45",
      changes: "Initial version with basic employee query",
      query: "SELECT e.first_name, e.last_name FROM employees e;"
    }
  ]);

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const [comments, setComments] = useState([
    {
      id: 1,
      author: "John Doe",
      time: "2 minutes ago",
      content: "This query looks good, but we might want to add an index on the salary column for better performance.",
      type: "suggestion"
    },
    {
      id: 2,
      author: "Jane Smith",
      time: "5 minutes ago", 
      content: "Approved for production use. Great work on the department join!",
      type: "approval"
    }
  ]);

  const tableSchemas = {
    employees: [
      { column: "employee_id", type: "integer", key: "PK" },
      { column: "first_name", type: "varchar(50)", key: "" },
      { column: "last_name", type: "varchar(50)", key: "" },
      { column: "department", type: "varchar(50)", key: "" },
      { column: "salary", type: "integer", key: "" },
      { column: "hire_date", type: "date", key: "" },
    ],
    departments: [
      { column: "department_id", type: "integer", key: "PK" },
      { column: "name", type: "varchar(50)", key: "" },
      { column: "budget", type: "integer", key: "" },
    ],
    projects: [
      { column: "project_id", type: "integer", key: "PK" },
      { column: "name", type: "varchar(100)", key: "" },
      { column: "description", type: "text", key: "" },
    ]
  };

  const handleSaveQuery = () => {
    setShowSaveDialog(true);
  };

  const handleAddStatement = () => {
    setShowAddStatementDialog(true);
  };

  const handleFormatQuery = () => {
    // Format the SQL query
    const formatted = sqlQuery
      .replace(/SELECT/gi, 'SELECT')
      .replace(/FROM/gi, '\nFROM')
      .replace(/WHERE/gi, '\nWHERE')
      .replace(/ORDER BY/gi, '\nORDER BY')
      .replace(/LEFT JOIN/gi, '\nLEFT JOIN')
      .replace(/INNER JOIN/gi, '\nINNER JOIN')
      .replace(/GROUP BY/gi, '\nGROUP BY')
      .replace(/HAVING/gi, '\nHAVING')
      .replace(/,\s*/g, ',\n    ')
      .replace(/\s+/g, ' ')
      .trim();
    
    setSqlQuery(formatted);
    toast({
      title: "Query Formatted",
      description: "SQL statement has been formatted successfully",
    });
  };

  const handleExportCSV = () => {
    // Simulate CSV export
    const csvContent = "first_name,last_name,department,salary\nJohn,Doe,Engineering,85000\nJane,Smith,Marketing,78000";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'query_results.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast({
      title: "CSV Downloaded",
      description: "Query results exported as CSV file",
    });
  };

  const handleShare = () => {
    setShowShareDialog(true);
  };

  const generateShareLink = () => {
    const shareUrl = `https://ddata-sql.lovable.app/shared/${Date.now()}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link Copied",
      description: "Share link has been copied to clipboard",
    });
    setShowShareDialog(false);
  };

  const handleRunQuery = () => {
    setQueryRunning(true);
    setShowComments(true);
    setQueryError(null);
    setQueryResults(null);
    
    // Simulate query execution with realistic success/error scenarios
    setTimeout(() => {
      setQueryRunning(false);
      
      // Simple query validation
      const query = sqlQuery.toLowerCase();
      if (query.includes('drop') || query.includes('delete') || query.includes('truncate')) {
        // Error case - dangerous operations
        setQueryError({
          type: "error",
          message: "Dangerous operation detected",
          suggestion: "Consider using SELECT statements for data exploration",
          line: 1
        });
        toast({
          title: "Query Error",
          description: "Dangerous operation detected in query",
          variant: "destructive"
        });
      } else if (!query.includes('select')) {
        // Error case - missing SELECT
        setQueryError({
          type: "error", 
          message: "Invalid SQL syntax",
          suggestion: "Query should start with SELECT keyword",
          line: 4
        });
        toast({
          title: "Syntax Error",
          description: "Query validation failed",
          variant: "destructive"
        });
      } else {
        // Success case
        setQueryResults({
          columns: ["first_name", "last_name", "department", "salary"],
          rows: [
            ["John", "Doe", "Engineering", "85000"],
            ["Jane", "Smith", "Marketing", "78000"],
            ["Bob", "Johnson", "Sales", "82000"],
            ["Alice", "Wilson", "Engineering", "90000"],
            ["Tom", "Brown", "Finance", "76000"]
          ],
          executionTime: "247ms",
          rowCount: 5
        });
        toast({
          title: "Query Executed Successfully",
          description: `Returned ${5} rows in 247ms`,
        });
      }
    }, 1500);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        author: "Current User",
        time: "Just now",
        content: newComment,
        type: "comment"
      };
      setComments([comment, ...comments]);
      setNewComment("");
    }
  };

  const saveQuery = () => {
    // Handle saving the query with title and description
    const newStatement = {
      id: savedStatements.length + 1,
      title: queryTitle,
      description: queryDescription,
      query: sqlQuery,
      createdAt: new Date().toISOString()
    };
    setSavedStatements([newStatement, ...savedStatements]);
    setShowSaveDialog(false);
    setShowComments(true);
    
    // Add a comment about the save
    const saveComment = {
      id: comments.length + 1,
      author: "System",
      time: "Just now",
      content: `Query "${queryTitle}" has been saved successfully.`,
      type: "system"
    };
    setComments([saveComment, ...comments]);
    
    toast({
      title: "Query Saved",
      description: `"${queryTitle}" has been saved to your statements`,
    });
    
    // Reset form
    setQueryTitle("");
    setQueryDescription("");
  };

  const addNewStatement = () => {
    const newStatement = {
      id: savedStatements.length + 1,
      title: queryTitle || "Untitled Query",
      description: queryDescription || "No description provided",
      query: sqlQuery,
      createdAt: new Date().toISOString()
    };
    setSavedStatements([newStatement, ...savedStatements]);
    setShowAddStatementDialog(false);
    
    toast({
      title: "Statement Added",
      description: "New SQL statement has been added successfully",
    });
    
    // Reset form
    setQueryTitle("");
    setQueryDescription("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              {/* dData Logo */}
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center font-bold text-lg text-primary-foreground">
                dP
              </div>
              <h1 className="text-xl font-semibold">dData SQL Editor</h1>
            </div>
            <Badge variant="secondary">Professional database query environment</Badge>
          </div>
          <div className="flex items-center space-x-4">
            {/* Mode Toggles */}
            <div className="flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-muted-foreground" />
              <Switch
                checked={businessMode}
                onCheckedChange={setBusinessMode}
              />
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {businessMode ? 'Business Mode' : 'Developer Mode'}
              </span>
            </div>
            
            {/* Dark Mode Toggle */}
            <div className="flex items-center space-x-2">
              <Sun className="w-4 h-4 text-muted-foreground" />
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
              <Moon className="w-4 h-4 text-muted-foreground" />
            </div>
            
            <Dialog open={showCollaborateDialog} onOpenChange={setShowCollaborateDialog}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Users className="w-4 h-4 mr-2" />
                  Collaborate
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Active Collaborators</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Team members currently working on this query:
                  </p>
                  <div className="space-y-3">
                    {activeUsers.map((user) => (
                      <div key={user.id} className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">
                            {user.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">{user.name}</span>
                            <div className="flex items-center space-x-1">
                              <Circle className={`w-2 h-2 fill-current ${
                                user.status === 'online' ? 'text-success' : 'text-warning'
                              }`} />
                              <span className="text-xs text-muted-foreground">{user.status}</span>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">{user.lastSeen}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Settings</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="general" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="editor">Editor</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="notifications">Alerts</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="general" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Theme & Display</h4>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Palette className="w-4 h-4" />
                          <span className="text-sm">Dark Mode</span>
                        </div>
                        <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Monitor className="w-4 h-4" />
                          <span className="text-sm">Business Mode</span>
                        </div>
                        <Switch checked={businessMode} onCheckedChange={setBusinessMode} />
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Auto-save Settings</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Auto-save interval</span>
                        <Select defaultValue="5">
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1m</SelectItem>
                            <SelectItem value="5">5m</SelectItem>
                            <SelectItem value="10">10m</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="editor" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Code Editor</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Font size</span>
                        <Select defaultValue="14">
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="12">12px</SelectItem>
                            <SelectItem value="14">14px</SelectItem>
                            <SelectItem value="16">16px</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Auto-completion</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Syntax highlighting</span>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="security" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4" />
                        <h4 className="text-sm font-medium">Query Permissions</h4>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Allow DELETE operations</span>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Allow DROP operations</span>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Require approval for production queries</span>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="notifications" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Bell className="w-4 h-4" />
                        <h4 className="text-sm font-medium">Notification Settings</h4>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Query completion alerts</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Collaboration notifications</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Error notifications</span>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <div className="w-80 border-r bg-card/50 flex flex-col">
          {/* Saved Statements */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Saved Statements
              </h3>
              <Dialog open={showAddStatementDialog} onOpenChange={setShowAddStatementDialog}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={handleAddStatement}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Statement</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Query Title</label>
                      <Input 
                        placeholder="Enter query title..."
                        value={queryTitle}
                        onChange={(e) => setQueryTitle(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea 
                        placeholder="Enter query description..."
                        value={queryDescription}
                        onChange={(e) => setQueryDescription(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowAddStatementDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={addNewStatement}>
                        Add Statement
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="text-sm text-muted-foreground">
              No saved statements yet
            </div>
          </div>

          {/* Database Schema */}
          <div className="flex-1 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium flex items-center">
                <Database className="w-4 h-4 mr-2" />
                Database Schema
              </h3>
            </div>
            
            <ScrollArea className="h-full">
              <div className="space-y-2">
                {Object.entries(tableSchemas).map(([tableName, columns]) => (
                  <Card key={tableName} className="p-3">
                    <div className="flex items-center space-x-2 mb-3">
                      <Table className="w-4 h-4 text-primary" />
                      <span className="font-medium capitalize">{tableName}</span>
                    </div>
                    <div className="space-y-1">
                      {columns.map((col, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <span className="text-foreground">{col.column}</span>
                          <div className="flex items-center space-x-1">
                            <span className="text-muted-foreground">{col.type}</span>
                            {col.key && (
                              <Badge variant="outline" className="text-xs px-1 py-0">
                                {col.key}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* SQL Query Editor */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b bg-card/30">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">SQL Query Editor</h2>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={handleFormatQuery}>
                    <Code className="w-4 h-4 mr-2" />
                    Format
                  </Button>
                  
                  <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={handleSaveQuery}>
                        <Save className="w-4 h-4 mr-2" />
                        Save SQL Statement
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Save SQL Statement</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Query Title</label>
                          <Input 
                            placeholder="Enter query title..."
                            value={queryTitle}
                            onChange={(e) => setQueryTitle(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Description</label>
                          <Textarea 
                            placeholder="Enter query description and usage instructions..."
                            value={queryDescription}
                            onChange={(e) => setQueryDescription(e.target.value)}
                            rows={3}
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <Dialog open={showVersionDialog} onOpenChange={setShowVersionDialog}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <History className="w-4 h-4 mr-2" />
                                Version History
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Version History & Edit Log</DialogTitle>
                              </DialogHeader>
                              <ScrollArea className="h-96">
                                <div className="space-y-4">
                                  {versionHistory.map((version) => (
                                    <Card key={version.id} className="p-4">
                                      <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center space-x-2">
                                          <Badge variant="outline">{version.version}</Badge>
                                          <span className="text-sm font-medium">{version.author}</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">{version.timestamp}</span>
                                      </div>
                                      <p className="text-sm text-muted-foreground mb-3">{version.changes}</p>
                                      <div className="bg-muted p-3 rounded text-xs font-mono">
                                        {version.query}
                                      </div>
                                      <div className="flex justify-end mt-2">
                                        <Button size="sm" variant="ghost" onClick={() => setSqlQuery(version.query)}>
                                          <GitBranch className="w-3 h-3 mr-1" />
                                          Restore
                                        </Button>
                                      </div>
                                    </Card>
                                  ))}
                                </div>
                              </ScrollArea>
                            </DialogContent>
                          </Dialog>
                          <div className="flex space-x-2">
                            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                              Cancel
                            </Button>
                            <Button onClick={saveQuery}>
                              Save Query
                            </Button>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button size="sm" onClick={handleRunQuery} disabled={queryRunning}>
                    <Play className="w-4 h-4 mr-2" />
                    {queryRunning ? "Running..." : "Run SQL"}
                  </Button>
                </div>
              </div>

              {/* Code Editor Area */}
              <Card className="min-h-[300px] overflow-hidden">
                <div className="bg-editor-background border-b px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-editor-comment">-- Advanced SQL Editor with Monaco</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="font-mono text-sm space-y-1">
                    {sqlQuery.split('\n').map((line, index) => (
                      <div key={index} className="flex">
                        <span className="w-8 text-editor-line-number text-right pr-2 select-none">
                          {index + 1}
                        </span>
                        <pre className="flex-1">
                          <code className="text-editor-foreground">
                            {line.includes('--') ? (
                              <span className="text-editor-comment">{line}</span>
                            ) : line.includes('SELECT') || line.includes('FROM') || line.includes('WHERE') || line.includes('ORDER BY') || line.includes('LEFT JOIN') ? (
                              <span className="text-editor-keyword font-semibold">{line}</span>
                            ) : line.includes("'") ? (
                              <span className="text-editor-string">{line}</span>
                            ) : line.match(/\d+/) ? (
                              <span className="text-editor-number">{line}</span>
                            ) : (
                              line
                            )}
                          </code>
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Query Results */}
            <div className="flex-1 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Query Results</h3>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={handleExportCSV}>
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                  
                  <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={handleShare}>
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Share Query</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Generate a shareable link for this query that your team can access.
                        </p>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setShowShareDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={generateShareLink}>
                            <Link className="w-4 h-4 mr-2" />
                            Generate Link
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <Card>
                <div className="p-4">
                  {queryRunning ? (
                    <div className="text-center py-8">
                      <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Executing query...</p>
                    </div>
                  ) : queryError ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 text-destructive">
                        <XCircle className="w-5 h-5" />
                        <h4 className="font-medium">Query Error</h4>
                      </div>
                      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                          <div className="flex-1">
                            <p className="text-destructive font-medium">{queryError.message}</p>
                            <p className="text-destructive/80 text-sm mt-1">
                              Line {queryError.line}: {queryError.suggestion}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>✓ Check your SQL syntax</p>
                        <p>✓ Verify table and column names exist</p>
                        <p>✓ Ensure proper permissions for the operation</p>
                      </div>
                    </div>
                  ) : queryResults ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-success">
                          <CheckCircle className="w-5 h-5" />
                          <h4 className="font-medium">Query Successful</h4>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{queryResults.rowCount} rows</span>
                          <span>{queryResults.executionTime}</span>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-muted/50 border-b">
                          <div className="grid grid-cols-4 gap-4 p-3 text-sm font-medium">
                            {queryResults.columns.map((col) => (
                              <div key={col} className="truncate">{col}</div>
                            ))}
                          </div>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          {queryResults.rows.map((row, idx) => (
                            <div key={idx} className="grid grid-cols-4 gap-4 p-3 text-sm border-b last:border-b-0 hover:bg-muted/30">
                              {row.map((cell, cellIdx) => (
                                <div key={cellIdx} className="truncate">{cell}</div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-success/10 border border-success/20 rounded-lg p-3">
                        <div className="flex items-center space-x-2 text-success text-sm">
                          <Check className="w-4 h-4" />
                          <span>Query executed successfully. Data retrieved from employees and departments tables.</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Run a SQL query to see results here</p>
                      <p className="text-sm mt-1">Tip: Press Ctrl+Enter to run the query</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Right Panel - Comments */}
        <div className="w-80 border-l bg-card/50 flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium flex items-center">
                <MessageCircle className="w-4 h-4 mr-2" />
                Comments & Discussion
              </h3>
              {showComments && (
                <Badge variant="secondary" className="text-xs">
                  {comments.length}
                </Badge>
              )}
            </div>
            
            {showComments && (
              <div className="flex space-x-2">
                <Input
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <Button size="sm" onClick={handleAddComment} disabled={!newComment.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex-1 p-4">
            {showComments ? (
              <ScrollArea className="h-full">
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <Card key={comment.id} className="p-3">
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">
                            {comment.author.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium">{comment.author}</span>
                            <Badge 
                              variant={
                                comment.type === 'approval' ? 'secondary' : 
                                comment.type === 'suggestion' ? 'outline' :
                                comment.type === 'system' ? 'secondary' :
                                'outline'
                              } 
                              className={`text-xs ${
                                comment.type === 'approval' ? 'bg-success text-success-foreground' :
                                comment.type === 'suggestion' ? 'bg-warning text-warning-foreground border-warning' :
                                ''
                              }`}
                            >
                              {comment.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {comment.content}
                          </p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="w-3 h-3 mr-1" />
                            {comment.time}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <Card>
                <div className="p-4">
                  <div className="text-center text-muted-foreground py-8">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="mb-2">No comments yet</p>
                    <p className="text-sm">Save a statement or run a query to start discussing</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SQLEditor;