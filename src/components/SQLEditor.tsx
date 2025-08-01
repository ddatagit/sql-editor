import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
  Search
} from "lucide-react";

const SQLEditor = () => {
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

  const [activeTab, setActiveTab] = useState("employees");

  const mockEmployees = [
    { id: 1, first_name: "John", last_name: "Doe", department: "Engineering", salary: 85000 },
    { id: 2, first_name: "Jane", last_name: "Smith", department: "Marketing", salary: 78000 },
    { id: 3, first_name: "Bob", last_name: "Johnson", department: "Sales", salary: 82000 },
  ];

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Database className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold">Advanced SQL Editor</h1>
            </div>
            <Badge variant="secondary">Professional database query environment</Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Users className="w-4 h-4 mr-2" />
              Collaborate
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
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
              <Button variant="ghost" size="sm">
                <Plus className="w-4 h-4" />
              </Button>
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
                  <Button variant="outline" size="sm">
                    <Code className="w-4 h-4 mr-2" />
                    Format
                  </Button>
                  <Button variant="outline" size="sm">
                    <Save className="w-4 h-4 mr-2" />
                    Save SQL Statement
                  </Button>
                  <Button size="sm">
                    <Play className="w-4 h-4 mr-2" />
                    Run SQL
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
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              <Card>
                <div className="p-4">
                  <div className="text-center text-muted-foreground py-8">
                    <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Run a SQL query to see results here</p>
                    <p className="text-sm mt-1">Tip: Press Ctrl+Enter to run the query</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Right Panel - Table Data */}
        <div className="w-80 border-l bg-card/50 flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">Table Data</h3>
            </div>
            <div className="flex space-x-1 mb-4">
              {Object.keys(tableSchemas).map((table) => (
                <Button
                  key={table}
                  variant={activeTab === table ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(table)}
                  className="text-xs"
                >
                  {table}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex-1 p-4">
            <Card>
              <div className="p-4">
                <h4 className="font-medium mb-3 capitalize">{activeTab}</h4>
                {activeTab === "employees" ? (
                  <div className="space-y-3">
                    {mockEmployees.map((emp) => (
                      <div key={emp.id} className="text-sm p-2 bg-muted/50 rounded">
                        <div className="font-medium">{emp.first_name} {emp.last_name}</div>
                        <div className="text-muted-foreground">{emp.department}</div>
                        <div className="text-primary">${emp.salary.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Table className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No data available</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SQLEditor;