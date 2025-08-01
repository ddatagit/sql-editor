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
  Circle,
  HelpCircle,
  BookOpen
} from "lucide-react";

const SQLEditor = () => {
  const { toast } = useToast();
  const [sqlQuery, setSqlQuery] = useState(`-- Advanced SQL Editor with Monaco
-- Features: Syntax highlighting, auto-completion, formatting

SELECT e.first_name,e.last_name,e.department,e.salary,d.budget as department_budget FROM employees e LEFT JOIN departments d ON e.department = d.name WHERE e.salary > 75000 ORDER BY e.salary DESC;`);

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
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const [autoCompletePosition, setAutoCompletePosition] = useState({ x: 0, y: 0 });
  const [autoCompleteSuggestions, setAutoCompleteSuggestions] = useState([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState("");
  const [showSQLHelp, setShowSQLHelp] = useState(false);

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

  // Prebuilt reports for business mode
  const [prebuiltReports] = useState([
    {
      id: 1,
      title: "Employee Performance Dashboard",
      description: "Monthly performance metrics by department",
      category: "HR",
      lastRun: "2 hours ago",
      query: `SELECT 
    d.name as department,
    COUNT(e.employee_id) as total_employees,
    AVG(e.salary) as avg_salary,
    MAX(e.salary) as max_salary
FROM employees e
JOIN departments d ON e.department = d.name
GROUP BY d.name
ORDER BY avg_salary DESC;`
    },
    {
      id: 2,
      title: "Revenue by Department",
      description: "Quarterly revenue breakdown and targets",
      category: "Finance",
      lastRun: "1 day ago",
      query: `SELECT 
    d.name as department,
    d.budget,
    COUNT(p.project_id) as active_projects
FROM departments d
LEFT JOIN projects p ON p.name LIKE CONCAT(d.name, '%')
ORDER BY d.budget DESC;`
    },
    {
      id: 3,
      title: "New Hires Report",
      description: "Recent hiring trends and onboarding status",
      category: "HR",
      lastRun: "3 hours ago",
      query: `SELECT 
    e.first_name,
    e.last_name,
    e.department,
    e.hire_date,
    DATEDIFF(CURDATE(), e.hire_date) as days_employed
FROM employees e
WHERE e.hire_date >= DATE_SUB(CURDATE(), INTERVAL 90 DAY)
ORDER BY e.hire_date DESC;`
    },
    {
      id: 4,
      title: "Salary Analysis",
      description: "Compensation benchmarks and equity analysis",
      category: "Finance",
      lastRun: "5 hours ago",
      query: `SELECT 
    e.department,
    COUNT(*) as employee_count,
    MIN(e.salary) as min_salary,
    AVG(e.salary) as avg_salary,
    MAX(e.salary) as max_salary
FROM employees e
GROUP BY e.department
ORDER BY avg_salary DESC;`
    }
  ]);

  // SQL Keywords and suggestions for auto-complete
  const sqlKeywords = [
    'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL JOIN',
    'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'UNION ALL',
    'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP', 'INDEX',
    'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'DISTINCT', 'AS', 'AND', 'OR', 'NOT',
    'NULL', 'IS NULL', 'IS NOT NULL', 'LIKE', 'IN', 'EXISTS', 'BETWEEN',
    'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'IF', 'COALESCE', 'CAST',
    'DATE', 'TIME', 'TIMESTAMP', 'YEAR', 'MONTH', 'DAY'
  ];

  const tableColumns = [
    // Employees table
    'employees.employee_id', 'employees.first_name', 'employees.last_name', 
    'employees.department', 'employees.salary', 'employees.hire_date',
    'e.employee_id', 'e.first_name', 'e.last_name', 'e.department', 'e.salary', 'e.hire_date',
    
    // Departments table  
    'departments.department_id', 'departments.name', 'departments.budget',
    'd.department_id', 'd.name', 'd.budget',
    
    // Projects table
    'projects.project_id', 'projects.name', 'projects.description',
    'p.project_id', 'p.name', 'p.description'
  ];

  const getAutoCompleteSuggestions = (currentWord) => {
    const word = currentWord.toLowerCase();
    const suggestions = [];
    
    // Add matching SQL keywords
    sqlKeywords.forEach(keyword => {
      if (keyword.toLowerCase().startsWith(word)) {
        suggestions.push({ type: 'keyword', value: keyword, description: 'SQL Keyword' });
      }
    });
    
    // Add matching table columns
    tableColumns.forEach(column => {
      if (column.toLowerCase().includes(word)) {
        suggestions.push({ type: 'column', value: column, description: 'Table Column' });
      }
    });
    
    // Add table names
    Object.keys(tableSchemas).forEach(table => {
      if (table.toLowerCase().startsWith(word)) {
        suggestions.push({ type: 'table', value: table, description: 'Table Name' });
      }
    });
    
    return suggestions.slice(0, 10); // Limit to 10 suggestions
  };

  const handleEditorKeyDown = (e) => {
    const textarea = e.target as HTMLTextAreaElement;
    
    if (showAutoComplete) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < autoCompleteSuggestions.length - 1 ? prev + 1 : 0
        );
        return;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : autoCompleteSuggestions.length - 1
        );
        return;
      } else if (e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault();
        if (autoCompleteSuggestions[selectedSuggestionIndex]) {
          insertAutoComplete(autoCompleteSuggestions[selectedSuggestionIndex]);
        }
        return;
      } else if (e.key === 'Escape') {
        setShowAutoComplete(false);
        return;
      }
    }
    
    if (e.key === ' ' && e.ctrlKey) {
      // Ctrl+Space to trigger auto-complete manually
      e.preventDefault();
      triggerAutoComplete(textarea);
    } else if (e.key === 'Enter' && e.ctrlKey) {
      // Ctrl+Enter to run query
      e.preventDefault();
      handleRunQuery();
    }
  };

  const handleEditorInput = (e) => {
    const value = e.target.value;
    setSqlQuery(value);
    
    // Auto-complete on typing (like Excel)
    const textarea = e.target as HTMLTextAreaElement;
    const cursorPos = textarea.selectionStart;
    const textBeforeCursor = value.substring(0, cursorPos);
    const words = textBeforeCursor.split(/\s+/);
    const currentWord = words[words.length - 1] || '';
    
    if (currentWord.length >= 2) {
      const suggestions = getAutoCompleteSuggestions(currentWord);
      if (suggestions.length > 0) {
        setCurrentWord(currentWord);
        setAutoCompleteSuggestions(suggestions);
        setSelectedSuggestionIndex(0);
        setShowAutoComplete(true);
        
        // Position the autocomplete popup
        const rect = textarea.getBoundingClientRect();
        setAutoCompletePosition({
          x: rect.left + (cursorPos * 8),
          y: rect.top + 20
        });
      } else {
        setShowAutoComplete(false);
      }
    } else {
      setShowAutoComplete(false);
    }
  };

  const triggerAutoComplete = (textarea) => {
    const cursorPos = textarea.selectionStart;
    const textBeforeCursor = sqlQuery.substring(0, cursorPos);
    const words = textBeforeCursor.split(/\s+/);
    const currentWord = words[words.length - 1] || '';
    
    const suggestions = getAutoCompleteSuggestions(currentWord);
    if (suggestions.length > 0) {
      setCurrentWord(currentWord);
      setAutoCompleteSuggestions(suggestions);
      setSelectedSuggestionIndex(0);
      setShowAutoComplete(true);
      
      const rect = textarea.getBoundingClientRect();
      setAutoCompletePosition({
        x: rect.left + (cursorPos * 8),
        y: rect.top + 20
      });
    }
  };

  const insertAutoComplete = (suggestion) => {
    const textarea = document.querySelector('.sql-editor-textarea') as HTMLTextAreaElement;
    if (textarea) {
      const cursorPos = textarea.selectionStart;
      const textBeforeCursor = sqlQuery.substring(0, cursorPos);
      const textAfterCursor = sqlQuery.substring(cursorPos);
      
      const newTextBefore = textBeforeCursor.substring(0, textBeforeCursor.length - currentWord.length);
      const newQuery = newTextBefore + suggestion.value + ' ' + textAfterCursor;
      
      setSqlQuery(newQuery);
      setShowAutoComplete(false);
      
      // Move cursor to after the inserted text
      setTimeout(() => {
        const newCursorPos = newTextBefore.length + suggestion.value.length + 1;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        textarea.focus();
      }, 0);
    }
  };

  const handleRestoreVersion = (version) => {
    setSqlQuery(version.query);
    setShowVersionDialog(false);
    
    toast({
      title: "Version Restored",
      description: `Restored to ${version.version} by ${version.author}`,
    });
    
    // Add a comment about the restore
    const restoreComment = {
      id: comments.length + 1,
      author: "System",
      time: "Just now",
      content: `Query restored to ${version.version} (${version.changes})`,
      type: "system"
    };
    setComments([restoreComment, ...comments]);
    setShowComments(true);
  };

  const handleRunPrebuiltReport = (report) => {
    setSqlQuery(report.query);
    setQueryTitle(report.title);
    setQueryDescription(report.description);
    
    toast({
      title: "Report Loaded",
      description: `"${report.title}" has been loaded into the editor`,
    });
    
    // Auto-run the report
    setTimeout(() => {
      handleRunQuery();
    }, 500);
  };

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
    // Advanced SQL formatting from messy to clean
    let formatted = sqlQuery
      // Remove extra whitespace and normalize
      .replace(/\s+/g, ' ')
      .trim()
      
      // Format SELECT statements
      .replace(/SELECT\s+/gi, 'SELECT\n    ')
      .replace(/,\s*(?=\w)/g, ',\n    ')
      
      // Format FROM clause
      .replace(/\s+FROM\s+/gi, '\nFROM ')
      
      // Format JOIN clauses
      .replace(/\s+(LEFT\s+JOIN|RIGHT\s+JOIN|INNER\s+JOIN|FULL\s+JOIN|JOIN)\s+/gi, '\n$1 ')
      .replace(/\s+ON\s+/gi, '\n    ON ')
      
      // Format WHERE clause
      .replace(/\s+WHERE\s+/gi, '\nWHERE ')
      .replace(/\s+(AND|OR)\s+/gi, '\n    $1 ')
      
      // Format GROUP BY
      .replace(/\s+GROUP\s+BY\s+/gi, '\nGROUP BY ')
      
      // Format HAVING
      .replace(/\s+HAVING\s+/gi, '\nHAVING ')
      
      // Format ORDER BY
      .replace(/\s+ORDER\s+BY\s+/gi, '\nORDER BY ')
      
      // Format LIMIT
      .replace(/\s+LIMIT\s+/gi, '\nLIMIT ')
      
      // Format subqueries
      .replace(/\(\s*SELECT/gi, '(\n    SELECT')
      .replace(/\)\s*(?=FROM|WHERE|ORDER|GROUP|HAVING|LIMIT|\)|;|$)/gi, '\n)')
      
      // Clean up extra spaces and ensure proper line endings
      .replace(/\n\s*\n/g, '\n')
      .replace(/^\s+/gm, (match) => {
        const level = Math.floor(match.length / 4);
        return '    '.repeat(level);
      });

    // Add proper indentation for nested queries
    const lines = formatted.split('\n');
    let indentLevel = 0;
    const formattedLines = lines.map(line => {
      const trimmed = line.trim();
      
      if (trimmed.includes('(')) indentLevel++;
      if (trimmed.includes(')')) indentLevel = Math.max(0, indentLevel - 1);
      
      if (trimmed.startsWith('SELECT') || 
          trimmed.startsWith('FROM') || 
          trimmed.startsWith('WHERE') || 
          trimmed.startsWith('GROUP BY') || 
          trimmed.startsWith('HAVING') || 
          trimmed.startsWith('ORDER BY') || 
          trimmed.startsWith('LIMIT')) {
        return '    '.repeat(indentLevel) + trimmed;
      } else if (trimmed.startsWith('LEFT JOIN') || 
                 trimmed.startsWith('RIGHT JOIN') || 
                 trimmed.startsWith('INNER JOIN') || 
                 trimmed.startsWith('FULL JOIN') || 
                 trimmed.startsWith('JOIN') || 
                 trimmed.startsWith('ON') || 
                 trimmed.startsWith('AND') || 
                 trimmed.startsWith('OR')) {
        return '    '.repeat(indentLevel + 1) + trimmed;
      } else if (trimmed.length > 0) {
        return '    '.repeat(indentLevel + 1) + trimmed;
      }
      return '';
    });

    const finalFormatted = formattedLines.join('\n').replace(/\n\s*\n/g, '\n');
    
    setSqlQuery(finalFormatted);
    toast({
      title: "Query Formatted",
      description: "SQL statement has been formatted and beautified",
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
    
    // Auto-save the query before running (optional)
    if (sqlQuery.trim() && queryTitle) {
      const autoSaveStatement = {
        id: Date.now(),
        title: queryTitle || `Auto-saved Query ${new Date().toLocaleTimeString()}`,
        description: "Auto-saved before execution",
        query: sqlQuery,
        createdAt: new Date().toISOString(),
        autoSaved: true
      };
      setSavedStatements(prev => [autoSaveStatement, ...prev]);
    }
    
    // Simulate query execution with realistic success/error scenarios
    setTimeout(() => {
      setQueryRunning(false);
      
      // Enhanced query validation based on actual typed content
      const query = sqlQuery.toLowerCase().trim();
      
      if (!query) {
        setQueryError({
          type: "error",
          message: "Empty query",
          suggestion: "Please enter a SQL statement to execute",
          line: 1
        });
        toast({
          title: "No Query",
          description: "Please enter a SQL statement to run",
          variant: "destructive"
        });
        return;
      }
      
      if (query.includes('drop') || query.includes('delete') || query.includes('truncate')) {
        // Error case - dangerous operations
        setQueryError({
          type: "error",
          message: "Dangerous operation detected",
          suggestion: "Consider using SELECT statements for data exploration. Use WITH caution for destructive operations.",
          line: query.split('\n').findIndex(line => 
            line.toLowerCase().includes('drop') || 
            line.toLowerCase().includes('delete') || 
            line.toLowerCase().includes('truncate')
          ) + 1
        });
        toast({
          title: "Query Blocked",
          description: "Dangerous operation detected - query execution halted",
          variant: "destructive"
        });
      } else if (!query.includes('select') && !query.includes('show') && !query.includes('describe')) {
        // Error case - invalid syntax
        setQueryError({
          type: "error", 
          message: "Invalid SQL syntax or unsupported operation",
          suggestion: "Query should start with SELECT, SHOW, or DESCRIBE keywords for data retrieval",
          line: 1
        });
        toast({
          title: "Syntax Error",
          description: "Query validation failed - check your SQL syntax",
          variant: "destructive"
        });
      } else {
        // Success case - simulate realistic results based on query content
        let mockResults;
        
        if (query.includes('employees') && query.includes('departments')) {
          mockResults = {
            columns: ["first_name", "last_name", "department", "salary", "department_budget"],
            rows: [
              ["John", "Doe", "Engineering", "85000", "500000"],
              ["Jane", "Smith", "Marketing", "78000", "300000"],
              ["Bob", "Johnson", "Sales", "82000", "400000"],
              ["Alice", "Wilson", "Engineering", "90000", "500000"],
              ["Tom", "Brown", "Finance", "76000", "250000"]
            ],
            executionTime: "247ms",
            rowCount: 5
          };
        } else if (query.includes('employees')) {
          mockResults = {
            columns: ["employee_id", "first_name", "last_name", "department", "salary"],
            rows: [
              ["1", "John", "Doe", "Engineering", "85000"],
              ["2", "Jane", "Smith", "Marketing", "78000"],
              ["3", "Bob", "Johnson", "Sales", "82000"],
              ["4", "Alice", "Wilson", "Engineering", "90000"],
              ["5", "Tom", "Brown", "Finance", "76000"],
              ["6", "Sarah", "Davis", "HR", "72000"],
              ["7", "Mike", "Miller", "IT", "88000"]
            ],
            executionTime: "156ms",
            rowCount: 7
          };
        } else if (query.includes('departments')) {
          mockResults = {
            columns: ["department_id", "name", "budget"],
            rows: [
              ["1", "Engineering", "500000"],
              ["2", "Marketing", "300000"],
              ["3", "Sales", "400000"],
              ["4", "Finance", "250000"],
              ["5", "HR", "180000"],
              ["6", "IT", "350000"]
            ],
            executionTime: "89ms",
            rowCount: 6
          };
        } else {
          // Generic result for other queries
          mockResults = {
            columns: ["result"],
            rows: [["Query executed successfully"]],
            executionTime: "45ms",
            rowCount: 1
          };
        }
        
        setQueryResults(mockResults);
        toast({
          title: "Query Executed Successfully",
          description: `Returned ${mockResults.rowCount} rows in ${mockResults.executionTime}`,
        });
        
        // Add execution comment
        const executionComment = {
          id: comments.length + 1,
          author: "System",
          time: "Just now",
          content: `Query executed successfully. Retrieved ${mockResults.rowCount} rows in ${mockResults.executionTime}.`,
          type: "system"
        };
        setComments([executionComment, ...comments]);
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
            
            <Dialog open={showSQLHelp} onOpenChange={setShowSQLHelp}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  SQL Help
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>SQL Formula Instructions</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    <TabsTrigger value="joins">Joins</TabsTrigger>
                    <TabsTrigger value="functions">Functions</TabsTrigger>
                    <TabsTrigger value="examples">Examples</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Basic SQL Commands</h4>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="bg-muted p-3 rounded">
                          <code className="text-sm">SELECT column1, column2 FROM table_name;</code>
                          <p className="text-xs text-muted-foreground mt-1">Retrieve data from specific columns</p>
                        </div>
                        <div className="bg-muted p-3 rounded">
                          <code className="text-sm">SELECT * FROM table_name WHERE condition;</code>
                          <p className="text-xs text-muted-foreground mt-1">Filter data with conditions</p>
                        </div>
                        <div className="bg-muted p-3 rounded">
                          <code className="text-sm">SELECT * FROM table_name ORDER BY column ASC/DESC;</code>
                          <p className="text-xs text-muted-foreground mt-1">Sort results ascending or descending</p>
                        </div>
                        <div className="bg-muted p-3 rounded">
                          <code className="text-sm">SELECT * FROM table_name LIMIT 10;</code>
                          <p className="text-xs text-muted-foreground mt-1">Limit number of results returned</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="joins" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">JOIN Operations</h4>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="bg-muted p-3 rounded">
                          <code className="text-sm">SELECT * FROM table1 INNER JOIN table2 ON table1.id = table2.id;</code>
                          <p className="text-xs text-muted-foreground mt-1">Returns only matching records from both tables</p>
                        </div>
                        <div className="bg-muted p-3 rounded">
                          <code className="text-sm">SELECT * FROM table1 LEFT JOIN table2 ON table1.id = table2.id;</code>
                          <p className="text-xs text-muted-foreground mt-1">Returns all from left table, matched from right</p>
                        </div>
                        <div className="bg-muted p-3 rounded">
                          <code className="text-sm">SELECT * FROM table1 RIGHT JOIN table2 ON table1.id = table2.id;</code>
                          <p className="text-xs text-muted-foreground mt-1">Returns all from right table, matched from left</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="functions" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">SQL Functions</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-muted p-3 rounded">
                          <code className="text-sm">COUNT(*)</code>
                          <p className="text-xs text-muted-foreground mt-1">Count rows</p>
                        </div>
                        <div className="bg-muted p-3 rounded">
                          <code className="text-sm">SUM(column)</code>
                          <p className="text-xs text-muted-foreground mt-1">Sum values</p>
                        </div>
                        <div className="bg-muted p-3 rounded">
                          <code className="text-sm">AVG(column)</code>
                          <p className="text-xs text-muted-foreground mt-1">Average value</p>
                        </div>
                        <div className="bg-muted p-3 rounded">
                          <code className="text-sm">MAX(column)</code>
                          <p className="text-xs text-muted-foreground mt-1">Maximum value</p>
                        </div>
                        <div className="bg-muted p-3 rounded">
                          <code className="text-sm">MIN(column)</code>
                          <p className="text-xs text-muted-foreground mt-1">Minimum value</p>
                        </div>
                        <div className="bg-muted p-3 rounded">
                          <code className="text-sm">DISTINCT</code>
                          <p className="text-xs text-muted-foreground mt-1">Unique values</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="examples" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Ready-to-Use Examples</h4>
                      <div className="space-y-3">
                        <div className="bg-muted p-3 rounded">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">High Salary Employees</span>
                            <Button size="sm" variant="ghost" onClick={() => {
                              setSqlQuery("SELECT first_name, last_name, salary FROM employees WHERE salary > 75000 ORDER BY salary DESC;");
                              setShowSQLHelp(false);
                            }}>Use</Button>
                          </div>
                          <code className="text-xs">SELECT first_name, last_name, salary FROM employees WHERE salary &gt; 75000 ORDER BY salary DESC;</code>
                        </div>
                        <div className="bg-muted p-3 rounded">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Department Summary</span>
                            <Button size="sm" variant="ghost" onClick={() => {
                              setSqlQuery("SELECT department, COUNT(*) as employee_count, AVG(salary) as avg_salary FROM employees GROUP BY department;");
                              setShowSQLHelp(false);
                            }}>Use</Button>
                          </div>
                          <code className="text-xs">SELECT department, COUNT(*) as employee_count, AVG(salary) as avg_salary FROM employees GROUP BY department;</code>
                        </div>
                        <div className="bg-muted p-3 rounded">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Employee with Department Info</span>
                            <Button size="sm" variant="ghost" onClick={() => {
                              setSqlQuery("SELECT e.first_name, e.last_name, e.salary, d.name as department, d.budget FROM employees e JOIN departments d ON e.department = d.name;");
                              setShowSQLHelp(false);
                            }}>Use</Button>
                          </div>
                          <code className="text-xs">SELECT e.first_name, e.last_name, e.salary, d.name as department, d.budget FROM employees e JOIN departments d ON e.department = d.name;</code>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
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
          {/* Prebuilt Reports - Only show in Business Mode */}
          {businessMode && (
            <div className="p-4 border-b bg-gradient-to-r from-primary/5 to-primary/10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium flex items-center">
                  <Building2 className="w-4 h-4 mr-2 text-primary" />
                  Prebuilt Reports
                </h3>
                <Badge variant="secondary" className="text-xs bg-primary/20 text-primary">
                  Business
                </Badge>
              </div>
              <ScrollArea className="max-h-64">
                <div className="space-y-2">
                  {prebuiltReports.map((report) => (
                    <Card 
                      key={report.id} 
                      className="p-3 cursor-pointer hover:bg-primary/5 transition-colors border-primary/20"
                      onClick={() => handleRunPrebuiltReport(report)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium mb-1">{report.title}</h4>
                          <p className="text-xs text-muted-foreground mb-2">{report.description}</p>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                              {report.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{report.lastRun}</span>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Play className="w-3 h-3" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

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
              {savedStatements.length === 0 ? "No saved statements yet" : `${savedStatements.length} saved statements`}
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
                  
                  {/* Quick Save - appears when there's content */}
                  {sqlQuery.trim() && (
                    <Button variant="outline" size="sm" onClick={() => {
                      const quickSave = {
                        id: Date.now(),
                        title: `Quick Save ${new Date().toLocaleTimeString()}`,
                        description: "Quickly saved from editor",
                        query: sqlQuery,
                        createdAt: new Date().toISOString(),
                        quickSaved: true
                      };
                      setSavedStatements(prev => [quickSave, ...prev]);
                      toast({
                        title: "Quick Saved",
                        description: "Query saved successfully",
                      });
                    }}>
                      <Save className="w-4 h-4 mr-2" />
                      Quick Save
                    </Button>
                  )}
                  
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
                                        <Button size="sm" variant="ghost" onClick={() => handleRestoreVersion(version)}>
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

                  <Button 
                    size="sm" 
                    onClick={handleRunQuery} 
                    disabled={queryRunning || !sqlQuery.trim()}
                    className={sqlQuery.trim() ? "bg-success hover:bg-success/90" : ""}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {queryRunning ? "Running..." : sqlQuery.trim() ? "Run & Deploy" : "Run SQL"}
                  </Button>
                </div>
              </div>

              {/* Code Editor Area */}
              <Card className="min-h-[300px] overflow-hidden relative">
                <div className="bg-editor-background border-b px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-editor-comment">-- Advanced SQL Editor with Monaco</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Ctrl+Space: Auto-complete • Ctrl+Enter: Run Query
                  </div>
                </div>
                <div className="p-4 relative">
                  <textarea
                    className="sql-editor-textarea w-full h-64 bg-transparent border-none outline-none resize-none font-mono text-sm leading-relaxed text-editor-foreground placeholder:text-muted-foreground"
                    value={sqlQuery}
                    onChange={handleEditorInput}
                    onKeyDown={handleEditorKeyDown}
                    placeholder="Type your SQL query here... 

Examples:
SELECT * FROM employees WHERE salary > 75000;
SELECT e.first_name, e.last_name, d.name FROM employees e JOIN departments d ON e.department = d.name;
SHOW TABLES;
DESCRIBE employees;"
                    spellCheck={false}
                  />
                  
                  {/* Live typing indicator */}
                  <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                    {sqlQuery.trim() ? `${sqlQuery.split('\n').length} lines • ${sqlQuery.length} chars` : 'Start typing...'}
                  </div>
                  
                  {/* Auto-complete popup */}
                  {showAutoComplete && (
                    <div 
                      className="absolute z-50 bg-popover border border-border rounded-lg shadow-lg max-w-xs min-w-48"
                      style={{ 
                        left: Math.min(autoCompletePosition.x, 300),
                        top: autoCompletePosition.y + 20
                      }}
                    >
                      <div className="p-2">
                        <div className="text-xs text-muted-foreground mb-2 px-2">
                          Suggestions (↑↓ to navigate, Tab/Enter to select)
                        </div>
                        <div className="space-y-1 max-h-48 overflow-y-auto">
                          {autoCompleteSuggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              className={`w-full text-left px-2 py-1 text-sm rounded flex items-center justify-between transition-colors ${
                                index === selectedSuggestionIndex 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'hover:bg-accent hover:text-accent-foreground'
                              }`}
                              onClick={() => insertAutoComplete(suggestion)}
                              onMouseEnter={() => setSelectedSuggestionIndex(index)}
                            >
                              <span className="font-mono truncate">{suggestion.value}</span>
                              <Badge 
                                variant={index === selectedSuggestionIndex ? "secondary" : "outline"} 
                                className="text-xs ml-2 flex-shrink-0"
                              >
                                {suggestion.type}
                              </Badge>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Syntax highlighted display (readonly) */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="p-4 pt-16">
                    <div className="font-mono text-sm space-y-1">
                      {sqlQuery.split('\n').map((line, index) => (
                        <div key={index} className="flex opacity-90">
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