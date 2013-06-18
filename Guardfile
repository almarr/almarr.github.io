# A sample Guardfile
# More info at https://github.com/guard/guard#readme

guard 'livereload' do
  watch(%r{_site/.+\.(css|js|html)})
  watch(%r{_posts/.+\.(md)})
end

guard 'sass', :input => '_scss', :output => 'css', :all_on_start => true
