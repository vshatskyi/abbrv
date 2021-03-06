require 'json'
STDOUT.sync = true
language_file_path = ARGV.first

class Expander
  def initialize(language_file_path)
    @language_file_path = language_file_path
  end

  def expand(abbreviation)
    language = JSON.parse(File.read(@language_file_path))
    language[abbreviation] || "#{abbreviation} is not defined"
  end
end


if __FILE__ == $PROGRAM_NAME
  expander = Expander.new(language_file_path)
  puts expander.expand($stdin.gets.chomp) while true
end
