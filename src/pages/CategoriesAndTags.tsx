import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  IconButton,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Folder as CategoryIcon,
  Label as TagIcon,
  Public as PublicIcon,
  Lock as PrivateIcon,
} from '@mui/icons-material';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../hooks/useCategories';
import { useTags, useCreateTag, useUpdateTag, useDeleteTag } from '../hooks/useTags';
import { CategoryForm } from '../components/forms/CategoryForm';
import { TagForm } from '../components/forms/TagForm';
import { Category, Tag } from '../types/api';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

export const CategoriesAndTags: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [tagFormOpen, setTagFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Categories
  const { data: categoriesResponse, isLoading: categoriesLoading } = useCategories({ pageSize: 100 });
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  // Tags
  const { data: tagsResponse, isLoading: tagsLoading } = useTags({ pageSize: 100 });
  const createTag = useCreateTag();
  const updateTag = useUpdateTag();
  const deleteTag = useDeleteTag();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Category handlers
  const handleCreateCategory = () => {
    setSelectedCategory(null);
    setCategoryFormOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setCategoryFormOpen(true);
  };

  const handleCategorySubmit = async (data: { name: string; description: string; color: string; parentId?: string; isPublic: boolean }) => {
    try {
      if (selectedCategory) {
        await updateCategory.mutateAsync({
          categoryId: selectedCategory.id,
          ...data,
          version: selectedCategory.version,
        });
        setNotification({ open: true, message: 'Category updated successfully', severity: 'success' });
      } else {
        await createCategory.mutateAsync(data);
        setNotification({ open: true, message: 'Category created successfully', severity: 'success' });
      }
      setCategoryFormOpen(false);
    } catch (error) {
      setNotification({ 
        open: true, 
        message: `Failed to ${selectedCategory ? 'update' : 'create'} category`, 
        severity: 'error' 
      });
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    if (window.confirm(`Are you sure you want to delete category "${category.name}"?`)) {
      try {
        await deleteCategory.mutateAsync({ categoryId: category.id, version: category.version });
        setNotification({ open: true, message: 'Category deleted successfully', severity: 'success' });
      } catch (error) {
        setNotification({ open: true, message: 'Failed to delete category', severity: 'error' });
      }
    }
  };

  // Tag handlers
  const handleCreateTag = () => {
    setSelectedTag(null);
    setTagFormOpen(true);
  };

  const handleEditTag = (tag: Tag) => {
    setSelectedTag(tag);
    setTagFormOpen(true);
  };

  const handleTagSubmit = async (data: { name: string; color: string }) => {
    try {
      if (selectedTag) {
        await updateTag.mutateAsync({
          tagId: selectedTag.id,
          ...data,
          version: selectedTag.version,
        });
        setNotification({ open: true, message: 'Tag updated successfully', severity: 'success' });
      } else {
        await createTag.mutateAsync(data);
        setNotification({ open: true, message: 'Tag created successfully', severity: 'success' });
      }
      setTagFormOpen(false);
    } catch (error) {
      setNotification({ 
        open: true, 
        message: `Failed to ${selectedTag ? 'update' : 'create'} tag`, 
        severity: 'error' 
      });
    }
  };

  const handleDeleteTag = async (tag: Tag) => {
    if (window.confirm(`Are you sure you want to delete tag "${tag.name}"?`)) {
      try {
        await deleteTag.mutateAsync({ tagId: tag.id, version: tag.version });
        setNotification({ open: true, message: 'Tag deleted successfully', severity: 'success' });
      } catch (error) {
        setNotification({ open: true, message: 'Failed to delete tag', severity: 'error' });
      }
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Categories & Tags
      </Typography>

      <Paper sx={{ width: '100%' }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab
            icon={<CategoryIcon />}
            label="Categories"
            iconPosition="start"
          />
          <Tab
            icon={<TagIcon />}
            label="Tags"
            iconPosition="start"
          />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          {/* Categories Tab */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Manage Categories</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateCategory}
            >
              Create Category
            </Button>
          </Box>

          <Grid container spacing={2}>
            {categoriesResponse?.categories.map((category) => (
              <Grid item xs={12} sm={6} md={4} key={category.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: 1,
                          backgroundColor: category.color,
                        }}
                      />
                      <Typography variant="h6" component="div" noWrap>
                        {category.name}
                      </Typography>
                      {category.isPublic ? (
                        <PublicIcon color="primary" fontSize="small" />
                      ) : (
                        <PrivateIcon color="disabled" fontSize="small" />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40 }}>
                      {category.description}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        size="small"
                        label={category.isPublic ? 'Public' : 'Private'}
                        color={category.isPublic ? 'primary' : 'default'}
                      />
                    </Box>
                  </CardContent>
                  <CardActions>
                    <IconButton
                      size="small"
                      onClick={() => handleEditCategory(category)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteCategory(category)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {categoriesResponse?.categories.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CategoryIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No Categories Yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create your first category to organize tasks.
              </Typography>
            </Box>
          )}
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          {/* Tags Tab */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Manage Tags</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateTag}
            >
              Create Tag
            </Button>
          </Box>

          <Grid container spacing={2}>
            {tagsResponse?.tags.map((tag) => (
              <Grid item xs={12} sm={6} md={4} key={tag.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: 1,
                          backgroundColor: tag.color,
                        }}
                      />
                      <Typography variant="h6" component="div">
                        {tag.name}
                      </Typography>
                    </Box>
                    <Chip
                      label={tag.name}
                      size="small"
                      style={{
                        backgroundColor: tag.color,
                        color: '#fff',
                      }}
                    />
                  </CardContent>
                  <CardActions>
                    <IconButton
                      size="small"
                      onClick={() => handleEditTag(tag)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteTag(tag)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {tagsResponse?.tags.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <TagIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No Tags Yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create your first tag to label and organize tasks.
              </Typography>
            </Box>
          )}
        </TabPanel>
      </Paper>

      {/* Forms */}
      <CategoryForm
        open={categoryFormOpen}
        onClose={() => setCategoryFormOpen(false)}
        onSubmit={handleCategorySubmit}
        category={selectedCategory}
        categories={categoriesResponse?.categories || []}
        loading={createCategory.isPending || updateCategory.isPending}
        error={createCategory.error?.message || updateCategory.error?.message}
      />

      <TagForm
        open={tagFormOpen}
        onClose={() => setTagFormOpen(false)}
        onSubmit={handleTagSubmit}
        tag={selectedTag}
        loading={createTag.isPending || updateTag.isPending}
        error={createTag.error?.message || updateTag.error?.message}
      />

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};