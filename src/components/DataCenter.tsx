import React, { useState, useEffect } from 'react';
import { 
  Star, Database, Plus, Trash2, Edit2, Columns, Filter, ArrowUpDown, 
  ChevronDown, ChevronRight, Save, Copy, Check, X, Search, FileSpreadsheet,
  AlertCircle, Info, MoveUp, MoveDown, Eye, EyeOff, Settings, List, PlusCircle, 
  FileText, Activity, Layers, HelpCircle, ArrowRight
} from 'lucide-react';
import { useAppState } from '../context/AppContext';
import { 
  DataCenterConfig, DataSourceType, ViewColumnConfig, ViewFilterConfig, 
  ViewSortConfig, CustomFieldConfig, SHIPS, MEMBERS
} from '../types';

export const DataCenter: React.FC = () => {
  const {
    projects,
    contracts,
    bids,
    suppliers,
    users,
    updateProject,
    updateContract,
    updateBid,
    preWorkflow,
    postWorkflow,
    postServiceWorkflow,
    bidWorkflow,
    workflowTemplates,
    nodeAttributes,
    addSystemLog
  } = useAppState();

  // Loaded configurations for online ledgers
  const [configs, setConfigs] = useState<DataCenterConfig[]>(() => {
    const saved = localStorage.getItem('p_workbench_datacenter_configs_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((c: any) => {
            // Safe migration from single string to array
            if (typeof c.dataSource === 'string') {
              c.dataSource = [c.dataSource];
            }
            return c;
          });
        }
      } catch (e) {
        console.error('Error parsing data center V2 configs', e);
      }
    }

    // Default premium seeds for V2 Online Ledgers
    const seeds: DataCenterConfig[] = [
      {
        id: 'ledger-all-business',
        name: '全量业务台账 (默认)',
        type: 'view',
        isStarred: true,
        dataSource: ['pre', 'purchase', 'service', 'bid'],
        granularity: 'auto',
        filters: [],
        sorts: [],
        columns: [
          { field: 'code', label: '编号', visible: true, order: 1, width: 140, sourceType: 'database', databaseField: 'code' },
          { field: 'name', label: '项目/合同/批次名称', visible: true, order: 2, width: 220, sourceType: 'database', databaseField: 'name' },
          { field: 'ship', label: '所属船舶', visible: true, order: 3, width: 100, sourceType: 'database', databaseField: 'ship' },
          { field: 'amount', label: '合同金额/结算金额', visible: true, order: 4, width: 120, sourceType: 'database', databaseField: 'amount' },
          { field: 'status', label: '当前节点', visible: true, order: 5, width: 125, sourceType: 'current_workflow' },
          { field: 'owners', label: '归属成员', visible: true, order: 6, width: 140, sourceType: 'database', databaseField: 'owners' },
          { field: 'createdAt', label: '建档/签署时间', visible: true, order: 7, width: 140, sourceType: 'database', databaseField: 'createdAt' }
        ],
        customFields: [],
        manualData: {},
        createdAt: new Date().toISOString()
      },
      {
        id: 'ledger-payment-reconciliation',
        name: '付款与对账台账',
        type: 'view',
        isStarred: true,
        dataSource: ['purchase'],
        granularity: 'auto',
        filters: [],
        sorts: [],
        columns: [
          { field: 'code', label: '合同编号', visible: true, order: 1, width: 140, sourceType: 'database', databaseField: 'code' },
          { field: 'name', label: '合同与批次名称', visible: true, order: 2, width: 220, sourceType: 'database', databaseField: 'name' },
          { field: 'ship', label: '所属船舶', visible: true, order: 3, width: 100, sourceType: 'database', databaseField: 'ship' },
          { field: 'amount', label: '结算金额', visible: true, order: 4, width: 120, sourceType: 'database', databaseField: 'amount' },
          { field: 'supplierId', label: '合作供应商', visible: true, order: 5, width: 180, sourceType: 'database', databaseField: 'supplierId' },
          { field: 'status', label: '当前节点', visible: true, order: 6, width: 125, sourceType: 'current_workflow' },
          { field: 'unpaid_amount', label: '未付尾款', visible: true, order: 7, width: 120, sourceType: 'calculated', calculatedFormula: 'unpaid_amount' },
          { field: 'history_send', label: '寄出时间', visible: true, order: 8, width: 140, sourceType: 'workflow_history', historyNodeAttr: '寄出', historyRule: 'leave' },
          { field: 'history_pay', label: '付款时间', visible: true, order: 9, width: 140, sourceType: 'workflow_history', historyNodeAttr: '付款', historyRule: 'leave' },
          { field: 'leader_remark', label: '领导批注 (手工列)', visible: true, order: 10, width: 180, sourceType: 'manual', manualFieldType: 'text' }
        ],
        customFields: [],
        manualData: {},
        createdAt: new Date().toISOString()
      },
      {
        id: 'ledger-pre-procurement',
        name: '前置船舶需求备件台账',
        type: 'view',
        isStarred: true,
        dataSource: ['pre'],
        granularity: 'auto',
        filters: [],
        sorts: [],
        columns: [
          { field: 'code', label: '项目编号', visible: true, order: 1, width: 130, sourceType: 'database', databaseField: 'code' },
          { field: 'name', label: '项目名称', visible: true, order: 2, width: 200, sourceType: 'database', databaseField: 'name' },
          { field: 'ship', label: '所属船舶', visible: true, order: 3, width: 100, sourceType: 'database', databaseField: 'ship' },
          { field: 'status', label: '审批节点', visible: true, order: 4, width: 120, sourceType: 'current_workflow' },
          { field: 'isUrgent', label: '是否紧急', visible: true, order: 5, width: 100, sourceType: 'database', databaseField: 'isUrgent' },
          { field: 'owners', label: '归属成员', visible: true, order: 6, width: 140, sourceType: 'database', databaseField: 'owners' },
          { field: 'history_approve', label: '审批通过时间', visible: true, order: 7, width: 145, sourceType: 'workflow_history', historyNodeAttr: '审批', historyRule: 'leave' },
          { field: 'manual_reconciliation_note', label: '采购核对意见', visible: true, order: 8, width: 180, sourceType: 'manual', manualFieldType: 'text' }
        ],
        customFields: [],
        manualData: {},
        createdAt: new Date().toISOString()
      },
      {
        id: 'ledger-bids-tracking',
        name: '标书推进与协作台账',
        type: 'view',
        isStarred: false,
        dataSource: ['bid'],
        granularity: 'auto',
        filters: [],
        sorts: [],
        columns: [
          { field: 'name', label: '标书名称', visible: true, order: 1, width: 220, sourceType: 'database', databaseField: 'name' },
          { field: 'ship', label: '所属船舶', visible: true, order: 2, width: 100, sourceType: 'database', databaseField: 'ship' },
          { field: 'tenderUnit', label: '招标单位', visible: true, order: 3, width: 180, sourceType: 'database', databaseField: 'tenderUnit' },
          { field: 'status', label: '当前环节', visible: true, order: 4, width: 120, sourceType: 'current_workflow' },
          { field: 'resultStatus', label: '投标结果', visible: true, order: 5, width: 110, sourceType: 'database', databaseField: 'resultStatus' },
          { field: 'dueDate', label: '截标日期', visible: true, order: 6, width: 120, sourceType: 'database', databaseField: 'dueDate' },
          { field: 'manual_bid_comment', label: '竞标随记', visible: true, order: 7, width: 180, sourceType: 'manual', manualFieldType: 'text' }
        ],
        customFields: [],
        manualData: {},
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('p_workbench_datacenter_configs_v2', JSON.stringify(seeds));
    return seeds;
  });

  // Keep localStorage synced
  useEffect(() => {
    localStorage.setItem('p_workbench_datacenter_configs_v2', JSON.stringify(configs));
  }, [configs]);

  // Selected ledger ID
  const [selectedConfigId, setSelectedConfigId] = useState<string | null>(() => {
    const saved = localStorage.getItem('p_workbench_datacenter_configs_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as DataCenterConfig[];
        if (parsed.length > 0) return parsed[0].id;
      } catch (e) {}
    }
    return 'ledger-all-business';
  });

  // Quick search query for table filtering
  const [searchQuery, setSearchQuery] = useState('');

  // Check if there is literally any business data in the system
  const isDatabaseEmpty = projects.length === 0 && contracts.length === 0 && bids.length === 0;

  // Expandable settings console toggles
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [activeConfigSection, setActiveConfigSection] = useState<'columns' | 'filters' | 'sorts'>('columns');

  // Interactive inline editing
  const [editingCell, setEditingCell] = useState<{ rowId: string; field: string } | null>(null);
  const [tempEditValue, setTempEditValue] = useState('');

  // Column specific editor sidebar/form inside configs panel
  const [configuringColField, setConfiguringColField] = useState<string | null>(null);

  // Form states for currently selected/edited column
  const [formColLabel, setFormColLabel] = useState('');
  const [formColSourceType, setFormColSourceType] = useState<'database' | 'current_workflow' | 'workflow_history' | 'calculated' | 'manual'>('database');
  const [formColDatabaseField, setFormColDatabaseField] = useState('');
  const [formColHistoryNodeAttr, setFormColHistoryNodeAttr] = useState('');
  const [formColHistoryRule, setFormColHistoryRule] = useState<'enter' | 'leave'>('leave');
  const [formColCalculatedFormula, setFormColCalculatedFormula] = useState<'unpaid_amount' | 'progress_rate' | 'days_elapsed'>('unpaid_amount');
  const [formColManualFieldType, setFormColManualFieldType] = useState<'text' | 'number'>('text');

  // Ledger title rename state
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState('');

  // Custom modals/notifications
  const [appAlert, setAppAlert] = useState<{ type: 'success' | 'info'; title: string; message: string } | null>(null);
  const [deleteConfigInfo, setDeleteConfigInfo] = useState<{ id: string; name: string } | null>(null);

  // Active ledger reference
  const activeConfig = configs.find(c => c.id === selectedConfigId);

  // Available system database fields based on source
  const SYSTEM_FIELDS_OPTS: Record<DataSourceType, { field: string; label: string }[]> = {
    pre: [
      { field: 'code', label: '项目编号' },
      { field: 'name', label: '项目名称' },
      { field: 'ship', label: '所属船舶' },
      { field: 'isUrgent', label: '是否紧急' },
      { field: 'dueDate', label: '截止日期' },
      { field: 'remark', label: '备注说明' },
      { field: 'owners', label: '归属成员' },
      { field: 'createdAt', label: '创建时间' },
    ],
    purchase: [
      { field: 'code', label: '合同编号' },
      { field: 'name', label: '合同名称' },
      { field: 'ship', label: '所属船舶' },
      { field: 'amount', label: '合同金额' },
      { field: 'supplierId', label: '合作供应商' },
      { field: 'contractStatus', label: '履行状态' },
      { field: 'isUrgent', label: '是否紧急' },
      { field: 'dueDate', label: '收付截止日' },
      { field: 'remark', label: '备注说明' },
      { field: 'owners', label: '归属成员' },
      { field: 'createdAt', label: '签署时间' },
    ],
    service: [
      { field: 'code', label: '合同编号' },
      { field: 'name', label: '合同名称' },
      { field: 'ship', label: '所属船舶' },
      { field: 'amount', label: '合同金额' },
      { field: 'supplierId', label: '合作服务商' },
      { field: 'contractStatus', label: '履行状态' },
      { field: 'isUrgent', label: '是否紧急' },
      { field: 'dueDate', label: '服务截止日' },
      { field: 'remark', label: '备注说明' },
      { field: 'owners', label: '归属成员' },
      { field: 'createdAt', label: '签署时间' },
    ],
    bid: [
      { field: 'name', label: '标书名称' },
      { field: 'ship', label: '所属船舶' },
      { field: 'tenderUnit', label: '招标单位' },
      { field: 'resultStatus', label: '投标结果' },
      { field: 'isUrgent', label: '是否紧急' },
      { field: 'dueDate', label: '截标日期' },
      { field: 'remark', label: '备注说明' },
      { field: 'owners', label: '归属成员' },
      { field: 'createdAt', label: '建档时间' },
    ]
  };

  // Helper to merge fields for multi-select sources
  const getCombinedSystemFields = (sources: DataSourceType[]) => {
    const fieldsMap = new Map<string, string>();
    const normalizedSources = Array.isArray(sources) ? sources : [sources];
    normalizedSources.forEach(src => {
      const opts = SYSTEM_FIELDS_OPTS[src] || [];
      opts.forEach(o => {
        fieldsMap.set(o.field, o.label);
      });
    });
    return Array.from(fieldsMap.entries()).map(([field, label]) => ({ field, label }));
  };

  // Toggle Favorite
  const handleToggleStar = (configId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConfigs(prev => prev.map(c => c.id === configId ? { ...c, isStarred: !c.isStarred } : c));
  };

  // Create Ledger
  const handleCreateNewConfig = () => {
    const id = `ledger-${Date.now()}`;
    const defaultSources: DataSourceType[] = ['pre', 'purchase', 'service', 'bid'];
    const fields = getCombinedSystemFields(defaultSources);
    
    const newConfig: DataCenterConfig = {
      id,
      name: `自定义在线台账 #${configs.length + 1}`,
      type: 'view',
      isStarred: false,
      dataSource: defaultSources,
      granularity: 'auto',
      filters: [],
      columns: fields.map((f, index) => ({
        field: f.field,
        label: f.label,
        visible: index < 6, // Show first 6 columns by default
        order: index + 1,
        width: 140,
        sourceType: 'database',
        databaseField: f.field
      })),
      sorts: [],
      customFields: [],
      manualData: {},
      createdAt: new Date().toISOString()
    };

    setConfigs(prev => [...prev, newConfig]);
    setSelectedConfigId(id);
    setIsConfigOpen(true);
    setActiveConfigSection('columns');
    setConfiguringColField(null);
    addSystemLog(`[数据中心 V2] 新增了在线台账: ${newConfig.name}`);
  };

  // Copy/Clone Ledger
  const handleCloneConfig = (config: DataCenterConfig) => {
    const id = `ledger-${Date.now()}`;
    const cloned: DataCenterConfig = {
      ...config,
      id,
      name: `${config.name} (复制)`,
      isStarred: false,
      createdAt: new Date().toISOString()
    };

    setConfigs(prev => [...prev, cloned]);
    setSelectedConfigId(id);
    addSystemLog(`[数据中心 V2] 复制了台账配置: ${config.name} -> ${cloned.name}`);
  };

  // Delete Ledger
  const handleDeleteConfig = (id: string, name: string) => {
    setDeleteConfigInfo({ id, name });
  };

  // Reset to default premium seeds
  const handleResetToSeeds = () => {
    if (window.confirm('确认重置整个台账系统为默认的三张高级台账模板吗？您自定义建立的台账将会被抹除。')) {
      localStorage.removeItem('p_workbench_datacenter_configs_v2');
      window.location.reload();
    }
  };

  // Source type switcher toggles one of the data sources
  const handleToggleSource = (src: DataSourceType) => {
    if (!activeConfig) return;
    const currentSources = Array.isArray(activeConfig.dataSource)
      ? activeConfig.dataSource
      : [activeConfig.dataSource as DataSourceType];

    let nextSources: DataSourceType[];
    if (currentSources.includes(src)) {
      if (currentSources.length <= 1) {
        alert('台账数据底座必须至少选择一个数据来源。');
        return;
      }
      nextSources = currentSources.filter(s => s !== src);
    } else {
      nextSources = [...currentSources, src];
    }

    setConfigs(prev => prev.map(c => c.id === activeConfig.id ? {
      ...c,
      dataSource: nextSources
    } : c));
    addSystemLog(`[数据中心 V2] 更改了台账【${activeConfig.name}】的数据来源: ${nextSources.join(', ')}`);
  };

  // Granularity settings handler
  const handleGranularityChange = (gran: 'contract' | 'batch' | 'auto') => {
    if (!activeConfig) return;
    setConfigs(prev => prev.map(c => c.id === activeConfig.id ? { ...c, granularity: gran } : c));
    addSystemLog(`[数据中心 V2] 将台账【${activeConfig.name}】的统计粒度调整为: ${gran === 'auto' ? '自适应' : gran === 'contract' ? '按合同' : '按批次'}`);
  };

  // Add a brand new column (supports all 5 types)
  const handleAddNewColumn = () => {
    if (!activeConfig) return;
    const key = `col_${Date.now()}`;
    const firstSource = activeConfig.dataSource[0] || 'purchase';
    const firstField = SYSTEM_FIELDS_OPTS[firstSource]?.[0]?.field || 'name';

    const newCol: ViewColumnConfig = {
      field: key,
      label: '未命名自定义列',
      visible: true,
      order: activeConfig.columns.length + 1,
      width: 140,
      sourceType: 'database',
      databaseField: firstField
    };

    setConfigs(prev => prev.map(c => c.id === activeConfig.id ? {
      ...c,
      columns: [...c.columns, newCol]
    } : c));

    // Open configuration drawer directly for this column
    handleEditColumnSettings(newCol);
  };

  // Delete Column
  const handleDeleteColumn = (colField: string) => {
    if (!activeConfig) return;
    setConfigs(prev => prev.map(c => {
      if (c.id === activeConfig.id) {
        // Filter out column
        const filteredColumns = c.columns.filter(col => col.field !== colField);
        // Normalize orders
        const reordered = filteredColumns
          .sort((a, b) => a.order - b.order)
          .map((col, idx) => ({ ...col, order: idx + 1 }));
        
        // Remove manual cell inputs for that column if applicable
        const manualData = { ...c.manualData };
        Object.keys(manualData).forEach(rowId => {
          if (manualData[rowId]) {
            delete manualData[rowId][colField];
          }
        });

        return {
          ...c,
          columns: reordered,
          manualData
        };
      }
      return c;
    }));

    if (configuringColField === colField) {
      setConfiguringColField(null);
    }
    addSystemLog(`[数据中心 V2] 删除了台账【${activeConfig.name}】下的列字段: ${colField}`);
  };

  // Set up values for column editor
  const handleEditColumnSettings = (col: ViewColumnConfig) => {
    setConfiguringColField(col.field);
    setFormColLabel(col.label);
    setFormColSourceType(col.sourceType || 'database');
    const firstSource = activeConfig?.dataSource?.[0] || 'purchase';
    setFormColDatabaseField(col.databaseField || SYSTEM_FIELDS_OPTS[firstSource]?.[0]?.field || 'name');
    setFormColHistoryNodeAttr(col.historyNodeAttr || nodeAttributes[0] || '付款');
    setFormColHistoryRule(col.historyRule || 'leave');
    setFormColCalculatedFormula(col.calculatedFormula || 'unpaid_amount');
    setFormColManualFieldType(col.manualFieldType || 'text');
  };

  // Save specific column configurations
  const handleSaveColumnSettings = () => {
    if (!activeConfig || !configuringColField) return;

    setConfigs(prev => prev.map(c => {
      if (c.id === activeConfig.id) {
        const updatedColumns = c.columns.map(col => {
          if (col.field === configuringColField) {
            return {
              ...col,
              label: formColLabel,
              sourceType: formColSourceType,
              databaseField: formColSourceType === 'database' ? formColDatabaseField : undefined,
              historyNodeAttr: formColSourceType === 'workflow_history' ? formColHistoryNodeAttr : undefined,
              historyRule: formColSourceType === 'workflow_history' ? formColHistoryRule : undefined,
              calculatedFormula: formColSourceType === 'calculated' ? formColCalculatedFormula : undefined,
              manualFieldType: formColSourceType === 'manual' ? formColManualFieldType : undefined
            };
          }
          return col;
        });
        return { ...c, columns: updatedColumns };
      }
      return c;
    }));

    setConfiguringColField(null);
    addSystemLog(`[数据中心 V2] 更新了台账【${activeConfig.name}】中列【${formColLabel}】的配置参数`);
  };

  // Column reordering (Move Up/Down)
  const handleMoveColumn = (field: string, direction: 'left' | 'right') => {
    if (!activeConfig) return;
    const cols = [...activeConfig.columns].sort((a, b) => a.order - b.order);
    const index = cols.findIndex(c => c.field === field);
    if (index === -1) return;

    if (direction === 'left' && index > 0) {
      const prevCol = cols[index - 1];
      const tempOrder = prevCol.order;
      prevCol.order = cols[index].order;
      cols[index].order = tempOrder;
    } else if (direction === 'right' && index < cols.length - 1) {
      const nextCol = cols[index + 1];
      const tempOrder = nextCol.order;
      nextCol.order = cols[index].order;
      cols[index].order = tempOrder;
    }

    setConfigs(prev => prev.map(c => c.id === activeConfig.id ? { ...c, columns: cols } : c));
  };

  // Toggle Column Visibility
  const handleToggleColumnVisibility = (field: string) => {
    if (!activeConfig) return;
    setConfigs(prev => prev.map(c => {
      if (c.id === activeConfig.id) {
        return {
          ...c,
          columns: c.columns.map(col => col.field === field ? { ...col, visible: !col.visible } : col)
        };
      }
      return c;
    }));
  };

  // Rename config title
  const handleRenameTitle = () => {
    if (!activeConfig || !tempTitle.trim()) return;
    setConfigs(prev => prev.map(c => c.id === activeConfig.id ? { ...c, name: tempTitle.trim() } : c));
    setIsEditingTitle(false);
  };

  // Filter condition management
  const handleAddFilter = () => {
    if (!activeConfig) return;
    const firstField = activeConfig.columns[0]?.field || 'name';
    const newFilter: ViewFilterConfig = {
      field: firstField,
      operator: 'contains',
      value: ''
    };
    setConfigs(prev => prev.map(c => c.id === activeConfig.id ? { ...c, filters: [...c.filters, newFilter] } : c));
  };

  const handleRemoveFilter = (index: number) => {
    if (!activeConfig) return;
    setConfigs(prev => prev.map(c => c.id === activeConfig.id ? {
      ...c,
      filters: c.filters.filter((_, idx) => idx !== index)
    } : c));
  };

  const handleUpdateFilter = (index: number, key: keyof ViewFilterConfig, value: any) => {
    if (!activeConfig) return;
    setConfigs(prev => prev.map(c => {
      if (c.id === activeConfig.id) {
        const updated = [...c.filters];
        updated[index] = { ...updated[index], [key]: value };
        return { ...c, filters: updated };
      }
      return c;
    }));
  };

  // Sorting rules management
  const handleAddSort = () => {
    if (!activeConfig) return;
    const firstField = activeConfig.columns[0]?.field || 'name';
    const newSort: ViewSortConfig = {
      field: firstField,
      direction: 'asc'
    };
    setConfigs(prev => prev.map(c => c.id === activeConfig.id ? { ...c, sorts: [...c.sorts, newSort] } : c));
  };

  const handleRemoveSort = (index: number) => {
    if (!activeConfig) return;
    setConfigs(prev => prev.map(c => c.id === activeConfig.id ? {
      ...c,
      sorts: c.sorts.filter((_, idx) => idx !== index)
    } : c));
  };

  const handleUpdateSort = (index: number, key: keyof ViewSortConfig, value: any) => {
    if (!activeConfig) return;
    setConfigs(prev => prev.map(c => {
      if (c.id === activeConfig.id) {
        const updated = [...c.sorts];
        updated[index] = { ...updated[index], [key]: value };
        return { ...c, sorts: updated };
      }
      return c;
    }));
  };

  // Save edited manual cell or double-bind update system fields
  const handleSaveCellValue = (rowId: string, col: ViewColumnConfig, val: string) => {
    if (!activeConfig) return;

    if (col.sourceType === 'manual') {
      // Persist manual inputs directly on the active ledger config
      setConfigs(prev => prev.map(c => {
        if (c.id === activeConfig.id) {
          const manualData = { ...c.manualData };
          if (!manualData[rowId]) {
            manualData[rowId] = {};
          }
          manualData[rowId][col.field] = val;
          return { ...c, manualData };
        }
        return c;
      }));
    } else if (col.sourceType === 'database' && col.databaseField) {
      // Directly persist system fields back to database
      const field = col.databaseField;
      let finalValue: any = val;
      if (field === 'amount') {
        finalValue = val;
      } else if (field === 'isUrgent') {
        finalValue = val === 'true';
      } else if (field === 'owners') {
        finalValue = val.split(',').map(v => v.trim()).filter(Boolean);
      }

      const allRows = expandLedgerRows();
      const targetRow = allRows.find(r => r.id === rowId);
      const source = targetRow?.sourceModule || 'purchase';
      if (source === 'pre') {
        updateProject(rowId, { [field]: finalValue });
      } else if (source === 'purchase' || source === 'service') {
        // Check if editing a contract sub-batch or root contract
        const contractExists = contracts.some(con => con.id === rowId);
        if (contractExists) {
          updateContract(rowId, { [field]: finalValue });
        } else {
          // If editing a batch, we update the settlement batch amount or name!
          // Find which contract contains this batch
          const parentContract = contracts.find(con => con.settlements?.some(s => s.id === rowId));
          if (parentContract && parentContract.settlements) {
            const updatedSettlements = parentContract.settlements.map(s => {
              if (s.id === rowId) {
                return { ...s, [field]: finalValue };
              }
              return s;
            });
            updateContract(parentContract.id, { settlements: updatedSettlements });
          }
        }
      } else if (source === 'bid') {
        updateBid(rowId, { [field]: finalValue });
      }
    }

    setEditingCell(null);
  };

  // --------------------------------------------------------
  // V2 Dynamic Ledger Row Expansion & Multi-Source Resolution
  // --------------------------------------------------------

  // Resolve history timestamp for items based on attribute mapping
  const resolveHistoryTime = (item: any, nodeAttr: string, rule: 'enter' | 'leave' = 'leave'): string => {
    if (!item || !item.history || !Array.isArray(item.history) || item.history.length === 0) return '';
    
    // Find template mapping steps
    let stepsWithAttr: string[] = [];
    const templateId = item.templateId;
    const tpl = workflowTemplates.find(t => t.id === templateId);
    if (tpl) {
      stepsWithAttr = tpl.steps.filter(s => s.nodeAttribute === nodeAttr).map(s => s.name);
    } else {
      // Check in generic defaults
      const allSteps = workflowTemplates.flatMap(t => t.steps.filter(s => s.nodeAttribute === nodeAttr).map(s => s.name));
      stepsWithAttr = Array.from(new Set(allSteps));

      const defaults = [...preWorkflow, ...postWorkflow, ...postServiceWorkflow, ...bidWorkflow];
      const defaultSteps = defaults.filter(s => s.nodeAttribute === nodeAttr).map(s => s.name);
      stepsWithAttr = Array.from(new Set([...stepsWithAttr, ...defaultSteps]));
    }

    if (stepsWithAttr.length === 0) {
      stepsWithAttr = [nodeAttr];
    }

    if (rule === 'leave') {
      // Find where we left the step
      const match = [...item.history].reverse().find(h => h.fromStep && (stepsWithAttr.includes(h.fromStep) || h.fromStep === nodeAttr));
      return match ? match.time : '';
    } else {
      // Find where we entered the step
      const match = [...item.history].reverse().find(h => h.toStep && (stepsWithAttr.includes(h.toStep) || h.toStep === nodeAttr));
      return match ? match.time : '';
    }
  };

  // Calculate unpaid amounts, progress, or days elapsed
  const resolveCalculatedField = (row: any, formula: 'unpaid_amount' | 'progress_rate' | 'days_elapsed'): string => {
    if (row.type === 'contract') {
      const contract = row.contract;
      const amt = parseFloat(String(contract.amount || '0').replace(/,/g, ''));
      
      let paidSum = 0;
      if (contract.settlements && Array.isArray(contract.settlements)) {
        contract.settlements.forEach((s: any) => {
          const isPaid = s.status.includes('付款完成') || s.status.includes('已完成') || s.status.includes('已付') || s.status.includes('完成');
          if (isPaid) {
            paidSum += parseFloat(String(s.amount || '0').replace(/,/g, ''));
          }
        });
      } else {
        const isPaid = contract.status.includes('付款完成') || contract.status.includes('已完成') || contract.status.includes('已付') || contract.status.includes('完成');
        if (isPaid) {
          paidSum = amt;
        }
      }

      if (formula === 'unpaid_amount') {
        const unpaid = Math.max(0, amt - paidSum);
        return unpaid.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      } else if (formula === 'progress_rate') {
        const rate = amt > 0 ? (paidSum / amt) * 100 : 0;
        return `${rate.toFixed(1)}%`;
      } else {
        const start = new Date(contract.createdAt || Date.now());
        const end = new Date();
        const days = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        return `${days} 天`;
      }
    } else if (row.type === 'batch') {
      const batch = row.batch;
      const contract = row.contract;
      const bAmt = parseFloat(String(batch.amount || '0').replace(/,/g, ''));
      const cAmt = parseFloat(String(contract.amount || '0').replace(/,/g, ''));

      if (formula === 'unpaid_amount') {
        const isPaid = batch.status.includes('付款完成') || batch.status.includes('已完成') || batch.status.includes('已付') || batch.status.includes('完成');
        return isPaid ? '0.00' : bAmt.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      } else if (formula === 'progress_rate') {
        const isPaid = batch.status.includes('付款完成') || batch.status.includes('已完成') || batch.status.includes('已付') || batch.status.includes('完成');
        const rate = cAmt > 0 ? ((isPaid ? bAmt : 0) / cAmt) * 100 : 0;
        return `${rate.toFixed(1)}%`;
      } else {
        const start = new Date(contract.createdAt || Date.now());
        const end = new Date();
        const days = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        return `${days} 天`;
      }
    } else {
      const item = row.item;
      if (formula === 'days_elapsed') {
        const start = new Date(item.createdAt || Date.now());
        const end = new Date();
        const days = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        return `${days} 天`;
      }
      return '--';
    }
  };

  // Generate expanded, flattened ledger rows based on granularity
  const expandLedgerRows = (): any[] => {
    if (!activeConfig) return [];
    
    const sources = Array.isArray(activeConfig.dataSource)
      ? activeConfig.dataSource
      : [activeConfig.dataSource as DataSourceType];
    const granularity = activeConfig.granularity || 'auto';

    // 1. Fetch raw underlying items and expand rows
    const expanded: any[] = [];

    sources.forEach(source => {
      let rawItems: any[] = [];
      if (source === 'pre') {
        rawItems = projects;
      } else if (source === 'purchase') {
        rawItems = contracts.filter(c => c.contractType === 'purchase');
      } else if (source === 'service') {
        rawItems = contracts.filter(c => c.contractType === 'service');
      } else if (source === 'bid') {
        rawItems = bids;
      }

      rawItems.forEach(item => {
        if (source === 'purchase' || source === 'service') {
          // For contracts, we respect granularity settings
          const isMulti = item.isMultiSettlement && item.settlements && item.settlements.length > 0;

          if (granularity === 'contract') {
            expanded.push({
              id: item.id,
              type: 'contract',
              contract: item,
              batch: undefined,
              rawItem: item,
              sourceModule: source
            });
          } else if (granularity === 'batch') {
            if (!isMulti) {
              expanded.push({
                id: `${item.id}-default`,
                type: 'batch',
                contract: item,
                batch: { id: `${item.id}-default`, name: '第1期结算 (合同级)', amount: item.amount, status: item.status, remark: item.remark },
                rawItem: item,
                sourceModule: source
              });
            } else {
              item.settlements.forEach((s: any) => {
                expanded.push({
                  id: s.id,
                  type: 'batch',
                  contract: item,
                  batch: s,
                  rawItem: item,
                  sourceModule: source
                });
              });
            }
          } else {
            // 'auto' mode (adaptive): contracts with multi-settlement split, others remain contract-level
            if (isMulti) {
              item.settlements.forEach((s: any) => {
                expanded.push({
                  id: s.id,
                  type: 'batch',
                  contract: item,
                  batch: s,
                  rawItem: item,
                  sourceModule: source
                });
              });
            } else {
              expanded.push({
                id: item.id,
                type: 'contract',
                contract: item,
                batch: undefined,
                rawItem: item,
                sourceModule: source
              });
            }
          }
        } else {
          // For pre-procurement and bid, always item level (no batch concept)
          expanded.push({
            id: item.id,
            type: 'item',
            item: item,
            rawItem: item,
            sourceModule: source
          });
        }
      });
    });

    // Default sort by creation time descending (unless user sorting is applied downstream)
    expanded.sort((a, b) => {
      const dateA = new Date(a.rawItem?.createdAt || 0).getTime();
      const dateB = new Date(b.rawItem?.createdAt || 0).getTime();
      return dateB - dateA;
    });

    return expanded;
  };

  // Resolve a specific cell's displayed value and raw value
  const resolveCell = (row: any, col: ViewColumnConfig) => {
    const sourceType = col.sourceType || 'database';

    // 1. Manual Inputs
    if (sourceType === 'manual') {
      const val = activeConfig?.manualData?.[row.id]?.[col.field] || '';
      return { val, display: val };
    }

    // 2. Current Status
    if (sourceType === 'current_workflow') {
      if (row.type === 'batch') {
        return { val: row.batch.status, display: row.batch.status };
      } else {
        return { val: row.rawItem.status, display: row.rawItem.status };
      }
    }

    // 3. Workflow History
    if (sourceType === 'workflow_history') {
      const nodeAttr = col.historyNodeAttr || '完成';
      const rule = col.historyRule || 'leave';
      const val = resolveHistoryTime(row.rawItem, nodeAttr, rule);
      return { val, display: val || '-' };
    }

    // 4. Smart Calculated Fields
    if (sourceType === 'calculated') {
      const formula = col.calculatedFormula || 'unpaid_amount';
      const val = resolveCalculatedField(row, formula);
      return { val, display: val };
    }

    // 5. Database System Field
    const dbField = col.databaseField || 'name';
    let val: any = '';

    if (row.type === 'batch') {
      const batch = row.batch;
      const contract = row.contract;

      if (dbField === 'code') {
        val = contract.code;
      } else if (dbField === 'name') {
        val = `${contract.name} [${batch.name}]`;
      } else if (dbField === 'ship') {
        val = batch.ship || contract.ship;
      } else if (dbField === 'amount') {
        val = batch.amount || '0';
      } else if (dbField === 'dueDate') {
        val = batch.dueDate || contract.dueDate;
      } else if (dbField === 'remark') {
        val = batch.remark || contract.remark;
      } else {
        val = contract[dbField];
      }
    } else {
      val = row.rawItem[dbField];
    }

    // Beautiful Formatting
    let display = '';
    if (dbField === 'supplierId' && val) {
      const s = suppliers.find(sup => sup.id === val);
      display = s ? s.name : '未指派供应商';
    } else if (dbField === 'owners' && Array.isArray(val)) {
      display = val.map(email => users.find(u => u.email === email)?.name || email).join(', ');
    } else if (dbField === 'isUrgent') {
      display = val ? '⚠️ 紧急' : '正常';
    } else if (dbField === 'amount' && val) {
      const num = parseFloat(String(val).replace(/,/g, ''));
      display = isNaN(num) ? String(val) : num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else {
      display = String(val ?? '');
    }

    return { val, display };
  };

  // Get processed data with Filters, Sorters, and Search
  const getProcessedData = (): any[] => {
    let rows = expandLedgerRows();

    if (!activeConfig) return [];

    // 1. Filter Multi-Rules
    if (activeConfig.filters.length > 0) {
      rows = rows.filter(row => {
        return activeConfig.filters.every(f => {
          // Find matching column to understand mapping
          const col = activeConfig.columns.find(c => c.field === f.field);
          if (!col) return true;

          const cell = resolveCell(row, col);
          const cellStr = String(cell.display || '').toLowerCase();
          const filterVal = f.value.toLowerCase();

          switch (f.operator) {
            case 'equals':
              return cellStr === filterVal;
            case 'not_equals':
              return cellStr !== filterVal;
            case 'contains':
              return cellStr.includes(filterVal);
            case 'greater_than_or_equal':
              if (!isNaN(Number(cell.val)) && !isNaN(Number(f.value))) {
                return Number(cell.val) >= Number(f.value);
              }
              return cellStr >= filterVal;
            case 'less_than_or_equal':
              if (!isNaN(Number(cell.val)) && !isNaN(Number(f.value))) {
                return Number(cell.val) <= Number(f.value);
              }
              return cellStr <= filterVal;
            default:
              return true;
          }
        });
      });
    }

    // 2. Sort Multi-Rules
    if (activeConfig.sorts.length > 0) {
      rows = [...rows].sort((a, b) => {
        for (const s of activeConfig.sorts) {
          const col = activeConfig.columns.find(c => c.field === s.field);
          if (!col) continue;

          const cellA = resolveCell(a, col);
          const cellB = resolveCell(b, col);

          let valA = cellA.val;
          let valB = cellB.val;

          if (valA === undefined || valA === null) valA = '';
          if (valB === undefined || valB === null) valB = '';

          const numA = Number(String(valA).replace(/,/g, ''));
          const numB = Number(String(valB).replace(/,/g, ''));

          if (!isNaN(numA) && !isNaN(numB) && valA !== '' && valB !== '') {
            if (numA < numB) return s.direction === 'asc' ? -1 : 1;
            if (numA > numB) return s.direction === 'asc' ? 1 : -1;
          } else {
            const strA = String(valA).toLowerCase();
            const strB = String(valB).toLowerCase();
            if (strA < strB) return s.direction === 'asc' ? -1 : 1;
            if (strA > strB) return s.direction === 'asc' ? 1 : -1;
          }
        }
        return 0;
      });
    }

    // 3. Quick Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const visibleCols = activeConfig.columns.filter(c => c.visible);

      rows = rows.filter(row => {
        return visibleCols.some(col => {
          const cell = resolveCell(row, col);
          return String(cell.display || '').toLowerCase().includes(q);
        });
      });
    }

    return rows;
  };

  // Helper calculation for column summary (totals bar)
  const getTotalsInfo = () => {
    const data = getProcessedData();
    let totalAmt = 0;
    let validAmtCount = 0;

    data.forEach(row => {
      let amountStr = '';
      if (row.type === 'batch') {
        amountStr = row.batch.amount || '';
      } else if (row.type === 'contract') {
        amountStr = row.contract.amount || '';
      }
      
      const num = parseFloat(String(amountStr).replace(/,/g, ''));
      if (!isNaN(num)) {
        totalAmt += num;
        validAmtCount++;
      }
    });

    return {
      count: data.length,
      hasAmounts: validAmtCount > 0,
      totalAmount: totalAmt.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    };
  };

  // Simulated Excel Download
  const handleExportToExcel = () => {
    if (!activeConfig) return;
    const items = getProcessedData();
    const headers = activeConfig.columns.filter(c => c.visible).map(c => c.label);
    
    addSystemLog(`[数据中心 V2] 成功导出了在线台账【${activeConfig.name}】，共包含 ${items.length} 行台账明细！`);
    setAppAlert({
      type: 'success',
      title: 'Excel 表格导出成功',
      message: `已自动打包后台数据流并生成以下本地台账表格：
【C:\\鸿鹄船舶采购\\数据台账\\导出\\${activeConfig.name}_${new Date().toISOString().split('T')[0]}.xlsx】

● 已完美整合 ${items.length} 行业务数据。
● 包含 ${headers.length} 列自定义智能列（含历史节点与手工列）。`
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto relative pb-12 animate-fade-in">
      
      {/* 📊 Premium Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center space-x-2">
            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">📊</span>
            <span>在线业务台账中心 (Online Ledgers)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            “像使用 Excel 一样，建立属于自己的在线台账，并且所有数据都由数据库自动维护、实时更新。”
          </p>
        </div>
        
        {/* Reset button & seeds loading */}
        <div className="mt-3 md:mt-0 flex items-center space-x-2">
          <button
            onClick={handleResetToSeeds}
            className="px-2.5 py-1 text-xs border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-lg cursor-pointer transition-colors"
            title="恢复到预设的高级对账台账"
          >
            🔄 恢复预设模板
          </button>
        </div>
      </div>

      {/* Main Workspace Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: ACTIVE ONLINE LEDGERS LIST                   */}
        {/* ========================================================= */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase">
              📋 永久在线台账
            </h3>
            <button
              onClick={handleCreateNewConfig}
              className="p-1 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors cursor-pointer flex items-center space-x-0.5 text-xs font-bold"
              title="新建空白台账"
            >
              <Plus size={14} />
              <span>新建台账</span>
            </button>
          </div>

          <div className="space-y-1 max-h-[450px] overflow-y-auto pr-1">
            {configs.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                暂无自定义台账，请点击上方“新建台账”
              </div>
            ) : (
              configs
                .sort((a, b) => {
                  if (a.isStarred && !b.isStarred) return -1;
                  if (!a.isStarred && b.isStarred) return 1;
                  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                })
                .map(c => {
                  const isActive = c.id === selectedConfigId;
                  
                  // Compute temp count
                  let itemsCount = 0;
                  try {
                    const source = c.dataSource;
                    const gran = c.granularity || 'auto';
                    let raw = [];
                    if (source === 'pre') raw = projects;
                    else if (source === 'purchase') raw = contracts.filter(co => co.contractType === 'purchase');
                    else if (source === 'service') raw = contracts.filter(co => co.contractType === 'service');
                    else if (source === 'bid') raw = bids;

                    if (source === 'purchase' || source === 'service') {
                      raw.forEach(con => {
                        const isMulti = con.isMultiSettlement && con.settlements && con.settlements.length > 0;
                        if (gran === 'contract') itemsCount++;
                        else if (gran === 'batch') {
                          itemsCount += isMulti ? con.settlements.length : 1;
                        } else {
                          itemsCount += isMulti ? con.settlements.length : 1;
                        }
                      });
                    } else {
                      itemsCount = raw.length;
                    }
                  } catch(e){}

                  return (
                    <div
                      key={c.id}
                      onClick={() => {
                        setSelectedConfigId(c.id);
                        setSearchQuery('');
                        setIsEditingTitle(false);
                        setConfiguringColField(null);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center justify-between border ${
                        isActive 
                          ? 'bg-slate-50 border-blue-200 text-slate-800 font-bold shadow-2xs' 
                          : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <button
                          onClick={(e) => handleToggleStar(c.id, e)}
                          className={`hover:scale-110 transition-transform ${
                            c.isStarred ? 'text-amber-500' : 'text-slate-300 hover:text-slate-400'
                          }`}
                        >
                          <Star size={13} fill={c.isStarred ? 'currentColor' : 'none'} />
                        </button>
                        <span className="truncate">{c.name}</span>
                      </div>
                      <div className="flex items-center space-x-1 shrink-0 ml-1.5">
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded-full font-mono scale-90">
                          {itemsCount}行
                        </span>
                        {isActive && (
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        )}
                      </div>
                    </div>
                  );
                })
            )}
          </div>

          <div className="border-t border-slate-100 pt-3.5 space-y-2">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 space-y-1">
              <div className="font-bold flex items-center space-x-1 text-slate-700">
                <Info size={12} />
                <span>面向采购员的台账中心</span>
              </div>
              <p className="leading-relaxed">
                无需理解复杂数据库，直接对台账追加“系统映射列”、“时间节点历史”或“手工备注列”，像 Excel 一样随手录入，自动持久化。
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: CORE SPREADSHEET CANVAS & PANEL              */}
        {/* ========================================================= */}
        <div className="lg:col-span-3 space-y-4">
          
          {activeConfig ? (
            <div className="space-y-4">
              
              {/* 1. Header with Title & Operations */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center space-x-3 min-w-0">
                  <button
                    onClick={(e) => handleToggleStar(activeConfig.id, e)}
                    className={`hover:scale-110 transition-transform ${
                      activeConfig.isStarred ? 'text-amber-500' : 'text-slate-300 hover:text-slate-400'
                    }`}
                  >
                    <Star size={18} fill={activeConfig.isStarred ? 'currentColor' : 'none'} />
                  </button>

                  {isEditingTitle ? (
                    <div className="flex items-center space-x-1">
                      <input
                        type="text"
                        value={tempTitle}
                        onChange={(e) => setTempTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRenameTitle()}
                        className="px-2 py-1 border border-slate-300 rounded text-sm font-bold focus:outline-none focus:border-blue-500 bg-white text-slate-800"
                        autoFocus
                      />
                      <button
                        onClick={handleRenameTitle}
                        className="p-1 bg-emerald-50 text-emerald-600 rounded hover:bg-emerald-100 cursor-pointer"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={() => setIsEditingTitle(false)}
                        className="p-1 bg-slate-100 text-slate-500 rounded hover:bg-slate-200 cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 truncate">
                      <h3 className="text-base font-bold text-slate-800 truncate">{activeConfig.name}</h3>
                      <button
                        onClick={() => {
                          setIsEditingTitle(true);
                          setTempTitle(activeConfig.name);
                        }}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-50 transition-colors"
                        title="修改台账名称"
                      >
                        <Edit2 size={13} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  
                  {/* Granularity Picker */}
                  {(activeConfig.dataSource.includes('purchase') || activeConfig.dataSource.includes('service')) && (
                    <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-[11px] font-bold">
                      <button
                        onClick={() => handleGranularityChange('auto')}
                        className={`px-2.5 py-1 rounded ${activeConfig.granularity === 'auto' || !activeConfig.granularity ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-400 hover:text-slate-600'}`}
                        title="多结算批次合同自动展开多行，普通合同保持单行"
                      >
                        🤖 智能混合
                      </button>
                      <button
                        onClick={() => handleGranularityChange('contract')}
                        className={`px-2.5 py-1 rounded ${activeConfig.granularity === 'contract' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-400 hover:text-slate-600'}`}
                        title="强制一个合同只占一行"
                      >
                        📄 按合同
                      </button>
                      <button
                        onClick={() => handleGranularityChange('batch')}
                        className={`px-2.5 py-1 rounded ${activeConfig.granularity === 'batch' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-400 hover:text-slate-600'}`}
                        title="强制所有结算批次单独成行"
                      >
                        📦 按批次
                      </button>
                    </div>
                  )}

                  {/* Toggle configuration panel */}
                  <button
                    onClick={() => {
                      setIsConfigOpen(!isConfigOpen);
                      setConfiguringColField(null);
                    }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors flex items-center space-x-1 border ${
                      isConfigOpen 
                        ? 'bg-slate-800 text-white border-slate-800' 
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Settings size={13} />
                    <span>{isConfigOpen ? '收起列配置' : '配置台账参数'}</span>
                    <ChevronDown size={12} className={`transform transition-transform ${isConfigOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Copy Ledger */}
                  <button
                    onClick={() => handleCloneConfig(activeConfig)}
                    className="p-1.5 border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
                    title="复制整套台账"
                  >
                    <Copy size={14} />
                  </button>

                  {/* Export */}
                  <button
                    onClick={handleExportToExcel}
                    className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm cursor-pointer transition-colors flex items-center space-x-1.5"
                  >
                    <FileSpreadsheet size={13} />
                    <span>导出 Excel</span>
                  </button>

                  {/* Delete Ledger */}
                  {configs.length > 1 && (
                    <button
                      onClick={() => handleDeleteConfig(activeConfig.id, activeConfig.name)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-lg transition-colors cursor-pointer"
                      title="删除这套台账"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* 2. Interactive Column, Filter & Sort Configuration Console */}
              {isConfigOpen && (
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 animate-slide-down">
                  
                  {/* Navigation Tabs */}
                  <div className="flex border-b border-slate-100 pb-2 flex-wrap gap-4">
                    <button
                      onClick={() => {
                        setActiveConfigSection('columns');
                        setConfiguringColField(null);
                      }}
                      className={`text-xs font-bold pb-2 border-b-2 transition-all cursor-pointer ${
                        activeConfigSection === 'columns' 
                          ? 'border-blue-600 text-blue-600' 
                          : 'border-transparent text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      🛠️ 台账列映射定义 ({activeConfig.columns.length})
                    </button>
                    <button
                      onClick={() => {
                        setActiveConfigSection('filters');
                        setConfiguringColField(null);
                      }}
                      className={`text-xs font-bold pb-2 border-b-2 transition-all cursor-pointer ${
                        activeConfigSection === 'filters' 
                          ? 'border-blue-600 text-blue-600' 
                          : 'border-transparent text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      🔍 智能筛选链 ({activeConfig.filters.length})
                    </button>
                    <button
                      onClick={() => {
                        setActiveConfigSection('sorts');
                        setConfiguringColField(null);
                      }}
                      className={`text-xs font-bold pb-2 border-b-2 transition-all cursor-pointer ${
                        activeConfigSection === 'sorts' 
                          ? 'border-blue-600 text-blue-600' 
                          : 'border-transparent text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      ↕️ 自动排序规范 ({activeConfig.sorts.length})
                    </button>
                  </div>

                  {/* TAB 1: COLUMNS CONFIG */}
                  {activeConfigSection === 'columns' && (
                    <div className="space-y-4">
                      
                      {/* Source Mapping Selector */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center space-x-2">
                            <Database size={13} className="text-indigo-600" />
                            <span className="text-xs font-bold text-slate-600">数据源组合底座 (可多选):</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            {[
                              { key: 'pre', label: '前置需求', color: 'bg-orange-50 border-orange-200 text-orange-700' },
                              { key: 'purchase', label: '采购合同', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
                              { key: 'service', label: '服务合同', color: 'bg-blue-50 border-blue-200 text-blue-700' },
                              { key: 'bid', label: '标书竞标', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' }
                            ].map(sourceItem => {
                              const currentSources = Array.isArray(activeConfig.dataSource)
                                ? activeConfig.dataSource
                                : [activeConfig.dataSource as DataSourceType];
                              const isChecked = currentSources.includes(sourceItem.key as DataSourceType);
                              return (
                                <button
                                  key={sourceItem.key}
                                  onClick={() => handleToggleSource(sourceItem.key as DataSourceType)}
                                  className={`px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer flex items-center space-x-1.5 ${
                                    isChecked
                                      ? `${sourceItem.color} border-indigo-500 ring-2 ring-indigo-100`
                                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    readOnly
                                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 pointer-events-none w-3 h-3"
                                  />
                                  <span>{sourceItem.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        <button
                          onClick={handleAddNewColumn}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 whitespace-nowrap self-start sm:self-auto"
                        >
                          <Plus size={12} />
                          <span>＋ 添加一列</span>
                        </button>
                      </div>

                      {/* Main Columns Mapping Designer */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* List of current Columns */}
                        <div className="space-y-1.5 max-h-[300px] overflow-y-auto border border-slate-150 rounded-lg p-2.5 bg-slate-50/50">
                          <span className="text-[10px] font-bold text-slate-400 block mb-1">
                            当前展示列 (支持向左/向右调整表格顺序)
                          </span>
                          
                          {activeConfig.columns
                            .sort((a, b) => a.order - b.order)
                            .map((col, index, arr) => {
                              const isConfiguring = configuringColField === col.field;
                              return (
                                <div
                                  key={col.field}
                                  onClick={() => handleEditColumnSettings(col)}
                                  className={`p-2 rounded-lg border flex items-center justify-between text-xs transition-all cursor-pointer ${
                                    isConfiguring
                                      ? 'bg-blue-50 border-blue-300 text-blue-800 font-bold'
                                      : col.visible 
                                        ? 'bg-white border-slate-200 text-slate-800 hover:border-slate-300' 
                                        : 'bg-white/60 border-slate-100 text-slate-400 opacity-70'
                                  }`}
                                >
                                  <div className="flex items-center space-x-2 truncate">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggleColumnVisibility(col.field);
                                      }}
                                      className="text-slate-400 hover:text-slate-600"
                                      title={col.visible ? "在表格中隐藏该列" : "在表格中显示该列"}
                                    >
                                      {col.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                                    </button>
                                    <span className="truncate">{col.label}</span>
                                    
                                    {/* Badges for source types */}
                                    <span className={`text-[8px] px-1 py-0.2 rounded font-normal ${
                                      col.sourceType === 'manual' ? 'bg-orange-100 text-orange-700' :
                                      col.sourceType === 'workflow_history' ? 'bg-purple-100 text-purple-700' :
                                      col.sourceType === 'calculated' ? 'bg-emerald-100 text-emerald-700' :
                                      col.sourceType === 'current_workflow' ? 'bg-cyan-100 text-cyan-700' :
                                      'bg-slate-100 text-slate-600'
                                    }`}>
                                      {col.sourceType === 'manual' ? '手工' :
                                       col.sourceType === 'workflow_history' ? '历史时间' :
                                       col.sourceType === 'calculated' ? '智能算力' :
                                       col.sourceType === 'current_workflow' ? '当前节点' :
                                       '主库字段'}
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center space-x-1 shrink-0 ml-1" onClick={(e) => e.stopPropagation()}>
                                    <button
                                      onClick={() => handleMoveColumn(col.field, 'left')}
                                      disabled={index === 0}
                                      className="p-0.5 rounded text-slate-400 hover:bg-slate-100 disabled:opacity-20 cursor-pointer"
                                      title="向左（上）移一列"
                                    >
                                      <MoveUp size={11} className="transform -rotate-90" />
                                    </button>
                                    <button
                                      onClick={() => handleMoveColumn(col.field, 'right')}
                                      disabled={index === arr.length - 1}
                                      className="p-0.5 rounded text-slate-400 hover:bg-slate-100 disabled:opacity-20 cursor-pointer"
                                      title="向右（下）移一列"
                                    >
                                      <MoveDown size={11} className="transform -rotate-90" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteColumn(col.field)}
                                      className="p-0.5 rounded text-rose-500 hover:bg-rose-50 cursor-pointer"
                                      title="删除此列"
                                    >
                                      <Trash2 size={11} />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                        </div>

                        {/* Column settings parameter editor form */}
                        <div className="border border-slate-150 rounded-lg p-3 bg-slate-50/50 space-y-3">
                          {configuringColField ? (
                            <div className="space-y-3.5 animate-fade-in text-xs">
                              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                                <span className="font-bold text-slate-700">⚙️ 配置该列的映射逻辑</span>
                                <span className="text-[10px] text-slate-400 font-mono">ID: {configuringColField}</span>
                              </div>

                              {/* Label input */}
                              <div className="space-y-1">
                                <label className="block font-semibold text-slate-600">列标头名称 (显示文本):</label>
                                <input
                                  type="text"
                                  value={formColLabel}
                                  onChange={(e) => setFormColLabel(e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 font-medium focus:outline-none focus:border-blue-500"
                                />
                              </div>

                              {/* Source Type Selector */}
                              <div className="space-y-1">
                                <label className="block font-semibold text-slate-600">数据源映射类型:</label>
                                <select
                                  value={formColSourceType}
                                  onChange={(e) => setFormColSourceType(e.target.value as any)}
                                  className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-slate-700 focus:outline-none focus:border-blue-500"
                                >
                                  <option value="database">📁 数据库系统字段 (如名称、编号、船舶、金额)</option>
                                  <option value="current_workflow">⏱️ 当前所处工作流节点 (如付款审批、对账)</option>
                                  <option value="workflow_history">🕒 特定节点历史完成时间点 (自动捕获历史纪录)</option>
                                  <option value="calculated">⚡ 算力计算字段 (未付尾款、付款进度、历时)</option>
                                  <option value="manual">✍️ 手工台账列 (空白列，支持采购员双击打字录入)</option>
                                </select>
                              </div>

                              {/* Contextual form options */}
                              {formColSourceType === 'database' && (
                                <div className="space-y-1 p-2 bg-white rounded border border-slate-100 animate-slide-down">
                                  <label className="block font-semibold text-slate-600">选择对应的系统物理字段:</label>
                                  <select
                                    value={formColDatabaseField}
                                    onChange={(e) => setFormColDatabaseField(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-slate-700"
                                  >
                                    {getCombinedSystemFields(activeConfig.dataSource).map(f => (
                                      <option key={f.field} value={f.field}>{f.label} ({f.field})</option>
                                    ))}
                                  </select>
                                </div>
                              )}

                              {formColSourceType === 'workflow_history' && (
                                <div className="space-y-2 p-2 bg-white rounded border border-slate-100 animate-slide-down">
                                  <div className="space-y-1">
                                    <label className="block font-semibold text-slate-600">关联工作流节点属性:</label>
                                    <select
                                      value={formColHistoryNodeAttr}
                                      onChange={(e) => setFormColHistoryNodeAttr(e.target.value)}
                                      className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-slate-700"
                                    >
                                      {nodeAttributes.map(attr => (
                                        <option key={attr} value={attr}>{attr}</option>
                                      ))}
                                    </select>
                                    <span className="text-[10px] text-slate-400 leading-normal block">
                                      根据该节点映射，系统会自动寻找具有相同业务含义的审批或结算步骤，无惧不同流程模板中的多变命名。
                                    </span>
                                  </div>
                                  <div className="space-y-1">
                                    <label className="block font-semibold text-slate-600">历史事件读取规则:</label>
                                    <select
                                      value={formColHistoryRule}
                                      onChange={(e) => setFormColHistoryRule(e.target.value as any)}
                                      className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-slate-700"
                                    >
                                      <option value="leave">离开该节点时 (代表对账完成、审批通过等事件)</option>
                                      <option value="enter">进入该节点时 (代表抵达此环节的时间点)</option>
                                    </select>
                                  </div>
                                </div>
                              )}

                              {formColSourceType === 'calculated' && (
                                <div className="space-y-1 p-2 bg-white rounded border border-slate-100 animate-slide-down">
                                  <label className="block font-semibold text-slate-600">智能算力公式选择:</label>
                                  <select
                                    value={formColCalculatedFormula}
                                    onChange={(e) => setFormColCalculatedFormula(e.target.value as any)}
                                    className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-slate-700"
                                  >
                                    <option value="unpaid_amount">未付金额 (合同金额 - 已付款批次之和)</option>
                                    <option value="progress_rate">付款进度 (已付款金额比例，百分比)</option>
                                    <option value="days_elapsed">历时天数 (自建档/签约至今的流转天数)</option>
                                  </select>
                                </div>
                              )}

                              {formColSourceType === 'manual' && (
                                <div className="space-y-1 p-2 bg-white rounded border border-slate-100 animate-slide-down">
                                  <label className="block font-semibold text-slate-600">手工单元格数据限制:</label>
                                  <select
                                    value={formColManualFieldType}
                                    onChange={(e) => setFormColManualFieldType(e.target.value as any)}
                                    className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-slate-700"
                                  >
                                    <option value="text">无限制文本 (Text)</option>
                                    <option value="number">纯数字 (Number)</option>
                                  </select>
                                </div>
                              )}

                              {/* Form submit buttons */}
                              <div className="flex items-center space-x-2 pt-1">
                                <button
                                  onClick={handleSaveColumnSettings}
                                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold cursor-pointer transition-colors"
                                >
                                  保存该列配置
                                </button>
                                <button
                                  onClick={() => setConfiguringColField(null)}
                                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded font-bold cursor-pointer transition-colors"
                                >
                                  取消
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
                              <Columns size={24} className="text-slate-300" />
                              <p className="text-xs">
                                点击左侧列表中的任意字段列，开始调配其业务含义与数据库自动同步规范。
                              </p>
                            </div>
                          )}
                        </div>

                      </div>

                    </div>
                  )}

                  {/* TAB 2: FILTERS */}
                  {activeConfigSection === 'filters' && (
                    <div className="space-y-3">
                      <p className="text-[10px] text-slate-400">
                        您可以为该台账建立高级链式筛选规则，所有规则将对台账产生实时联动过滤效应。
                      </p>

                      <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                        {activeConfig.filters.length === 0 ? (
                          <div className="text-center py-6 text-xs text-slate-400 border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
                            暂未设定任何筛选条件，全量展示
                          </div>
                        ) : (
                          activeConfig.filters.map((filter, index) => (
                            <div key={index} className="flex items-center space-x-2 bg-slate-50 p-2 rounded-lg border border-slate-150 animate-fade-in">
                              
                              <select
                                value={filter.field}
                                onChange={(e) => handleUpdateFilter(index, 'field', e.target.value)}
                                className="bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-700 focus:outline-none"
                              >
                                {activeConfig.columns.map(c => (
                                  <option key={c.field} value={c.field}>{c.label}</option>
                                ))}
                              </select>

                              <select
                                value={filter.operator}
                                onChange={(e) => handleUpdateFilter(index, 'operator', e.target.value as any)}
                                className="bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-700 focus:outline-none"
                              >
                                <option value="contains">包含 (Contains)</option>
                                <option value="equals">等于 (=)</option>
                                <option value="not_equals">不等于 (!=)</option>
                                <option value="greater_than_or_equal">大于等于 (&gt;=)</option>
                                <option value="less_than_or_equal">小于等于 (&lt;=)</option>
                              </select>

                              <input
                                type="text"
                                placeholder="比较值..."
                                value={filter.value}
                                onChange={(e) => handleUpdateFilter(index, 'value', e.target.value)}
                                className="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 flex-grow"
                              />

                              <button
                                onClick={() => handleRemoveFilter(index)}
                                className="p-1 text-rose-500 hover:bg-rose-50 rounded cursor-pointer"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>

                      <button
                        onClick={handleAddFilter}
                        className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-100 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
                      >
                        <Plus size={13} />
                        <span>新增过滤规则</span>
                      </button>
                    </div>
                  )}

                  {/* TAB 3: SORTS */}
                  {activeConfigSection === 'sorts' && (
                    <div className="space-y-3">
                      <p className="text-[10px] text-slate-400">
                        为台账列表添加高级复合排序规范。支持多权重多级排序。
                      </p>

                      <div className="space-y-2">
                        {activeConfig.sorts.length === 0 ? (
                          <div className="text-center py-6 text-xs text-slate-400 border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
                            暂无排序权重规则，按签署时间倒序展示
                          </div>
                        ) : (
                          activeConfig.sorts.map((sort, index) => (
                            <div key={index} className="flex items-center space-x-2 bg-slate-50 p-2 rounded-lg border border-slate-150 animate-fade-in">
                              <select
                                value={sort.field}
                                onChange={(e) => handleUpdateSort(index, 'field', e.target.value)}
                                className="bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-700 focus:outline-none"
                              >
                                {activeConfig.columns.map(c => (
                                  <option key={c.field} value={c.field}>{c.label}</option>
                                ))}
                              </select>

                              <select
                                value={sort.direction}
                                onChange={(e) => handleUpdateSort(index, 'direction', e.target.value as any)}
                                className="bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-700 focus:outline-none"
                              >
                                <option value="asc">升序 (A-Z ↑)</option>
                                <option value="desc">降序 (Z-A ↓)</option>
                              </select>

                              <button
                                onClick={() => handleRemoveSort(index)}
                                className="p-1 text-rose-500 hover:bg-rose-50 rounded cursor-pointer"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>

                      <button
                        onClick={handleAddSort}
                        className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-100 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
                      >
                        <Plus size={13} />
                        <span>追加排序级别</span>
                      </button>
                    </div>
                  )}

                </div>
              )}

              {/* 3. Dynamic Interactive Spreadsheet Grid Canvas */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
                
                {/* Search & Tooltips bar */}
                <div className="p-4 border-b border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="relative max-w-sm w-full">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                      <Search size={14} />
                    </div>
                    <input
                      type="text"
                      placeholder={`在当前 ${getProcessedData().length} 行台账中检索明细...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="block w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
                    />
                  </div>

                  <div className="text-[10px] text-slate-400 flex items-center space-x-2 font-medium">
                    <span className="inline-block h-1.5 w-1.5 bg-indigo-500 rounded-full animate-pulse" />
                    <span>双击单元格开启行内极速修改；手工列支持就地记账并本地永久封存。</span>
                  </div>
                </div>

                {/* Spreadsheet Grid Core */}
                <div className="overflow-x-auto w-full">
                  {isDatabaseEmpty ? (
                    <div className="text-center py-20 space-y-3 bg-white rounded-xl border border-dashed border-slate-200 m-4">
                      <div className="text-4xl">📁</div>
                      <p className="text-sm font-bold text-slate-500">
                        暂无数据，请先到采购工作台或标书管理中录入数据
                      </p>
                      <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                        数据中心的数据直接实时同步自后台数据库。当您在工作台建立需求、签署合同或开展标书推进后，此处将自动呈现对应的智能台账。
                      </p>
                    </div>
                  ) : getProcessedData().length === 0 ? (
                    <div className="text-center py-20 space-y-3 bg-white rounded-xl border border-dashed border-slate-200 m-4">
                      <div className="text-4xl text-slate-300">🔍</div>
                      <p className="text-sm font-bold text-slate-500">
                        当前筛选条件下没有符合的数据
                      </p>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                        当前台账规则或检索关键词排除了所有条目。请尝试清除检索内容或移除过滤配置。
                      </p>
                      <div className="pt-2">
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            // Clear filters in activeConfig
                            setConfigs(prev => prev.map(c => c.id === activeConfig.id ? { ...c, filters: [] } : c));
                          }}
                          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center space-x-1"
                        >
                          <span>🗑️ 清除所有筛选条件</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <table className="min-w-full divide-y divide-slate-100 text-left border-collapse table-fixed">
                      
                      <colgroup>
                        {activeConfig.columns
                          .sort((a, b) => a.order - b.order)
                          .filter(c => c.visible)
                          .map(c => (
                            <col key={c.field} style={{ width: c.width || 140 }} />
                          ))}
                      </colgroup>

                      <thead className="bg-slate-50 text-slate-600 font-bold select-none border-b border-slate-200 text-[11px] uppercase tracking-wider">
                        <tr>
                          {activeConfig.columns
                            .sort((a, b) => a.order - b.order)
                            .filter(c => c.visible)
                            .map(c => (
                              <th key={c.field} className="px-4 py-3 font-bold border-b border-slate-150">
                                <div className="flex items-center space-x-1">
                                  <span>{c.label}</span>
                                  {activeConfig.sorts.some(s => s.field === c.field) && (
                                    <ArrowUpDown size={11} className="text-blue-500" />
                                  )}
                                </div>
                              </th>
                            ))}
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100 bg-white">
                        {getProcessedData().map((row) => (
                          <tr key={row.id} className="hover:bg-slate-50/40 group/row transition-colors">
                            {activeConfig.columns
                              .sort((a, b) => a.order - b.order)
                              .filter(c => c.visible)
                              .map(col => {
                                const isEditing = editingCell?.rowId === row.id && editingCell?.field === col.field;
                                const cellData = resolveCell(row, col);

                                return (
                                  <td
                                    key={col.field}
                                    onDoubleClick={() => {
                                      // Can edit standard database fields OR manual cells
                                      const isEditable = col.sourceType === 'manual' || 
                                        (col.sourceType === 'database' && [
                                          'code', 'name', 'ship', 'amount', 'dueDate', 'remark', 
                                          'supplierId', 'isUrgent', 'contractStatus'
                                        ].includes(col.databaseField || ''));

                                      if (isEditable) {
                                        setEditingCell({ rowId: row.id, field: col.field });
                                        setTempEditValue(String(cellData.val ?? ''));
                                      }
                                    }}
                                    className="px-4 py-3 text-xs text-slate-700 font-medium truncate relative group border-b border-slate-100"
                                  >
                                    {isEditing ? (
                                      <div className="absolute inset-1 z-10 bg-white shadow-md rounded-md border border-blue-500 flex items-center p-1">
                                        
                                        {/* RENDER EDIT INPUTS BY TYPE */}
                                        {col.sourceType === 'database' && col.databaseField === 'ship' ? (
                                          <select
                                            value={tempEditValue}
                                            onChange={(e) => handleSaveCellValue(row.id, col, e.target.value)}
                                            onBlur={() => handleSaveCellValue(row.id, col, tempEditValue)}
                                            className="w-full text-xs font-semibold focus:outline-none bg-white py-0.5"
                                            autoFocus
                                          >
                                            {SHIPS.map(ship => (
                                              <option key={ship} value={ship}>{ship}</option>
                                            ))}
                                          </select>
                                        ) : col.sourceType === 'database' && col.databaseField === 'isUrgent' ? (
                                          <select
                                            value={tempEditValue}
                                            onChange={(e) => handleSaveCellValue(row.id, col, e.target.value)}
                                            onBlur={() => handleSaveCellValue(row.id, col, tempEditValue)}
                                            className="w-full text-xs font-semibold focus:outline-none bg-white py-0.5"
                                            autoFocus
                                          >
                                            <option value="true">⚠️ 紧急</option>
                                            <option value="false">正常</option>
                                          </select>
                                        ) : col.sourceType === 'database' && col.databaseField === 'supplierId' ? (
                                          <select
                                            value={tempEditValue}
                                            onChange={(e) => handleSaveCellValue(row.id, col, e.target.value)}
                                            onBlur={() => handleSaveCellValue(row.id, col, tempEditValue)}
                                            className="w-full text-xs font-semibold focus:outline-none bg-white py-0.5"
                                            autoFocus
                                          >
                                            <option value="">-- 未指派合作方 --</option>
                                            {suppliers.map(sup => (
                                              <option key={sup.id} value={sup.id}>{sup.name}</option>
                                            ))}
                                          </select>
                                        ) : col.sourceType === 'database' && col.databaseField === 'contractStatus' ? (
                                          <select
                                            value={tempEditValue}
                                            onChange={(e) => handleSaveCellValue(row.id, col, e.target.value)}
                                            onBlur={() => handleSaveCellValue(row.id, col, tempEditValue)}
                                            className="w-full text-xs font-semibold focus:outline-none bg-white py-0.5"
                                            autoFocus
                                          >
                                            <option value="执行中">执行中</option>
                                            <option value="已完成">已完成</option>
                                            <option value="已终止">已终止</option>
                                          </select>
                                        ) : (
                                          <input
                                            type={col.manualFieldType === 'number' ? 'number' : 'text'}
                                            value={tempEditValue}
                                            onChange={(e) => setTempEditValue(e.target.value)}
                                            onKeyDown={(e) => {
                                              if (e.key === 'Enter') handleSaveCellValue(row.id, col, tempEditValue);
                                              if (e.key === 'Escape') setEditingCell(null);
                                            }}
                                            onBlur={() => handleSaveCellValue(row.id, col, tempEditValue)}
                                            className="w-full h-full border-0 p-0 text-xs text-slate-800 font-medium focus:ring-0 focus:outline-none"
                                            autoFocus
                                          />
                                        )}

                                      </div>
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-between">
                                        <span className={`truncate font-mono ${
                                          col.sourceType === 'calculated' && col.calculatedFormula === 'unpaid_amount' && cellData.display !== '0.00' ? 'text-amber-600 font-bold' :
                                          col.sourceType === 'calculated' && col.calculatedFormula === 'progress_rate' ? 'text-indigo-600 font-bold' :
                                          col.sourceType === 'manual' ? 'text-slate-800' :
                                          col.databaseField === 'isUrgent' && cellData.val ? 'text-rose-600 font-bold' : ''
                                        }`}>
                                          {cellData.display || (
                                            <span className="text-slate-300 font-normal italic">
                                              {col.sourceType === 'manual' ? '双击录入台账...' : '-'}
                                            </span>
                                          )}
                                        </span>
                                        
                                        {/* Hover shortcut indicator for editable cells */}
                                        {(col.sourceType === 'manual' || 
                                          (col.sourceType === 'database' && [
                                            'code', 'name', 'ship', 'amount', 'dueDate', 'remark', 
                                            'supplierId', 'isUrgent', 'contractStatus'
                                          ].includes(col.databaseField || ''))) && (
                                            <button
                                              onClick={() => {
                                                setEditingCell({ rowId: row.id, field: col.field });
                                                setTempEditValue(String(cellData.val ?? ''));
                                              }}
                                              className="opacity-0 group-hover/row:opacity-100 p-0.5 text-slate-400 hover:text-slate-600 rounded bg-slate-100/80 cursor-pointer ml-1 shrink-0 transition-opacity"
                                              title="快捷双击/点击修改此单元格"
                                            >
                                              <Edit2 size={10} />
                                            </button>
                                        )}
                                      </div>
                                    )}
                                  </td>
                                );
                              })}
                          </tr>
                        ))}
                      </tbody>

                    </table>
                  )}
                </div>

                {/* Ledger Dynamic totals summary bar */}
                <div className="p-3 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center space-x-2.5">
                    <span>当前过滤展示记录: <b>{getTotalsInfo().count}</b> 行</span>
                    {getTotalsInfo().hasAmounts && (
                      <span className="font-bold text-slate-700 bg-slate-200/60 px-2 py-0.5 rounded">
                        💰 累计金额统计: ¥{getTotalsInfo().totalAmount}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1.5 text-slate-400 text-[10px]">
                    <Activity size={12} className="text-indigo-500 animate-pulse" />
                    <span>系统已连接后台：主工作台所有数据库修改将即时、永久地双向灌录至本台账中。</span>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-16 text-center text-slate-400">
              请先在左侧选择或新建一个自定义台账模板。
            </div>
          )}

        </div>

      </div>

      {/* ========================================================= */}
      {/* MODALS & PORTALS (iframe compatible)                      */}
      {/* ========================================================= */}
      {appAlert && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-150 max-w-sm w-full p-6 space-y-4">
            <div className="flex items-start space-x-3 text-left">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0 mt-0.5">
                <span className="text-lg">🎉</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-800">{appAlert.title}</h3>
                <p className="text-xs text-slate-500 whitespace-pre-wrap leading-relaxed">
                  {appAlert.message}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end pt-1">
              <button
                type="button"
                onClick={() => setAppAlert(null)}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfigInfo && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-150 max-w-sm w-full p-6 space-y-4">
            <div className="flex items-start space-x-3 text-left">
              <div className="p-2 bg-rose-50 text-rose-600 rounded-lg shrink-0 mt-0.5">
                <Trash2 size={18} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-800">确认删除该业务台账？</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  确定要彻底删除该在线台账【<span className="font-bold text-slate-800">{deleteConfigInfo.name}</span>】吗？
                  删除后，其相关的特殊列映射及手工备注明细数据将一并清理。该操作无法撤销。
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setDeleteConfigInfo(null)}
                className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-600 transition-all cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfigs(prev => prev.filter(c => c.id !== deleteConfigInfo.id));
                  addSystemLog(`[数据中心 V2] 删除了在线台账: ${deleteConfigInfo.name}`);
                  setDeleteConfigInfo(null);
                  // fallback select remaining
                  const rem = configs.filter(c => c.id !== deleteConfigInfo.id);
                  if (rem.length > 0) {
                    setSelectedConfigId(rem[0].id);
                  } else {
                    setSelectedConfigId(null);
                  }
                }}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                确认彻底删除
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
